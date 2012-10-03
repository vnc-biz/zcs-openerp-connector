# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

from osv import fields, osv
import base64
import email
import tools
import binascii
import dateutil.parser
import vobject
from base_calendar import base_calendar
from caldav import calendar
from datetime import datetime
import re
import pooler
from email.header import decode_header

class email_server_tools(osv.osv_memory):
    _name = "email.server.tools"
    
    
    def _decode_header(self, text):
        """Returns unicode() string conversion of the the given encoded smtp header"""
        if text:
            text = decode_header(text.replace('\r', ''))
            return ''.join([tools.ustr(x[0], x[1]) for x in text])

    def to_email(self,text):
        return re.findall(r'([^ ,<@]+@[^> ,]+)',text)
    
    def history(self, cr, uid, model, res_ids, msg, attach, context=None):
        """This function creates history for mails fetched
        @param self: The object pointer
        @param cr: the current row, from the database cursor,
        @param uid: the current user’s ID for security checks,
        @param model: OpenObject Model
        @param res_ids: Ids of the record of OpenObject model created
        @param msg: Email details
        @param attach: Email attachments
        """
        if isinstance(res_ids, (int, long)):
            res_ids = [res_ids]

        msg_pool = self.pool.get('mail.message')
        for res_id in res_ids:
            case = self.pool.get(model).browse(cr, uid, res_id, context=context)
            partner_id = hasattr(case, 'partner_id') and (case.partner_id and case.partner_id.id or False) or False
            if not partner_id and model == 'res.partner':
                partner_id = res_id
            msg_data = {
                'name': msg.get('subject', 'No subject'),
                'subject': msg.get('subject', 'No subject'),
                'date': msg.get('date'),
                'body_text': msg.get('body', msg.get('from')),
                'history': True,
                'partner_id': partner_id,
                'model': model,
                'email_cc': msg.get('cc'),
                'email_from': msg.get('from'),
                'email_to': msg.get('to'),
                'message_id': msg.get('message-id'),
                'references': msg.get('references') or msg.get('in-reply-to'),
                'res_id': res_id,
                'user_id': uid,
                'attachment_ids': [(6, 0, attach)]
            }
            msg_pool.create(cr, uid, msg_data, context=context)
        return True
    
    def history_message(self, cr, uid, model, res_id, message, context=None):
        #@param message: string of mail which is read from EML File
        attachment_pool = self.pool.get('ir.attachment')
        msg = self.parse_message(message)
        attachments = msg.get('attachments', [])
        att_ids = []
        for attachment in attachments:
            data_attach = {
                'name': attachment,
                'datas': binascii.b2a_base64(str(attachments.get(attachment))),
                'datas_fname': attachment,
                'description': 'Mail attachment From zimbra msg_id: %s' %(msg.get('message_id', '')),
                'res_model': model,
                'res_id': res_id,
            }
            att_ids.append(attachment_pool.create(cr, uid, data_attach))
        return self.history(cr, uid, model, res_id, msg, att_ids)

    def parse_message(self, message):
        #TOCHECK: put this function in mailgateway module
        if isinstance(message, unicode):
            message = message.encode('utf-8')
        msg_txt = email.message_from_string(message)
        message_id = msg_txt.get('message-id', False)
        msg = {}
        fields = msg_txt.keys()
        msg['id'] = message_id
        msg['message-id'] = message_id
        if 'Subject' in fields:
            msg['subject'] = self._decode_header(msg_txt.get('Subject'))

        if 'Content-Type' in fields:
            msg['content-type'] = msg_txt.get('Content-Type')

        if 'From' in fields:
            msg['from'] = self._decode_header(msg_txt.get('From'))

        if 'To' in fields:
            msg['to'] = self._decode_header(msg_txt.get('To'))
        else:
            msg['to'] = self._decode_header(msg_txt.get('Delivered-To'))

        if 'Cc' in fields:
            msg['cc'] = self._decode_header(msg_txt.get('Cc'))

        if 'Reply-to' in fields:
            msg['reply'] = self._decode_header(msg_txt.get('Reply-To'))

        if 'Date' in fields:
            date = self._decode_header(msg_txt.get('Date'))
            msg['date'] = dateutil.parser.parse(date).strftime("%Y-%m-%d %H:%M:%S")

        if 'Content-Transfer-Encoding' in fields:
            msg['encoding'] = msg_txt.get('Content-Transfer-Encoding')

        if 'References' in fields:
            msg['references'] = msg_txt.get('References')

        if 'In-Reply-To' in fields:
            msg['in-reply-to'] = msg_txt.get('In-Reply-To')

        if 'X-Priority' in fields:
            msg['priority'] = msg_txt.get('X-Priority', '3 (Normal)').split(' ')[0]

        if not msg_txt.is_multipart() or 'text/plain' in msg.get('Content-Type', ''):
            encoding = msg_txt.get_content_charset()
            body = msg_txt.get_payload(decode=True)
            msg['body'] = tools.ustr(body, encoding)

        attachments = {}
        has_plain_text = False
        if msg_txt.is_multipart() or 'multipart/alternative' in msg.get('content-type', ''):
            body = ""
            for part in msg_txt.walk():
                if part.get_content_maintype() == 'multipart':
                    continue

                encoding = part.get_content_charset()
                filename = part.get_filename()
                if part.get_content_maintype()=='text':
                    content = part.get_payload(decode=True)
                    if filename:
                        attachments[filename] = content
                    elif not has_plain_text:
                        # main content parts should have 'text' maintype
                        # and no filename. we ignore the html part if
                        # there is already a plaintext part without filename,
                        # because presumably these are alternatives.
                        content = tools.ustr(content, encoding)
                        if part.get_content_subtype() == 'html':
                            body = tools.ustr(tools.html2plaintext(content))
                        elif part.get_content_subtype() == 'plain':
                            body = content
                            has_plain_text = True
                elif part.get_content_maintype() in ('application', 'image'):
                    if filename :
                        attachments[filename] = part.get_payload(decode=True)
                    else:
                        res = part.get_payload(decode=True)
                        body += tools.ustr(res, encoding)

            msg['body'] = body
            msg['attachments'] = attachments
        return msg
email_server_tools()

class zimbra_partner(osv.osv_memory):
    _name = "zimbra.partner"
    _description="Zimbra Plugin Tools"

    def create_contact(self,cr,user,vals):
        dictcreate = dict(vals)
        # Set False value if 'undefined' for record. Id User does not spicify the values, Thunerbird set 'undefined' by default for new contact.
        for key in dictcreate:
            if dictcreate[key] == 'undefined':
                dictcreate[key] = False
        if not eval(dictcreate.get('partner_id')):
            dictcreate.update({'partner_id': False})
        create_id = self.pool.get('res.partner.address').create(cr, user, dictcreate)
        return create_id

    def history_message(self, cr, uid, vals):
        for val in vals:
            if not isinstance(val, (list,tuple)):
                continue
            if val[0] == 'message':
                val[1] = base64.decodestring(val[1])
        dictcreate = dict(vals)
        ref_ids = str(dictcreate.get('ref_ids')).split(';')
        msg = dictcreate.get('message')
        mail = msg
        msg = self.pool.get('email.server.tools').parse_message(msg)
        server_tools_pool = self.pool.get('email.server.tools')
        message_id = msg.get('message-id', False)
        msg_pool = self.pool.get('mail.message')
        msg_ids = []
        res = {}
        res_ids = []
        obj_list= ['crm.lead','project.issue','hr.applicant','res.partner']
        for ref_id in ref_ids:
            msg_new = dictcreate.get('message')
            ref = ref_id.split(',')
            model = ref[0]
            res_id = int(ref[1])
            if message_id:
                msg_ids = msg_pool.search(cr, uid, [('message_id','=',message_id),('res_id','=',res_id),('model','=',model)])
                if msg_ids and len(msg_ids):
                    continue
            if model not in obj_list:
                res={}
                obj_attch = self.pool.get('ir.attachment')
                ls = ['*', '/', '\\', '<', '>', ':', '?', '"', '|', '\t', '\n',':','~']
                sub = msg.get('subject','NO-SUBJECT').replace(' ','')
                if sub.strip() == '':
                   sub = 'NO SBUJECT'
                fn = sub
                for c in ls:
                   fn = fn.replace(c,'')
                if len(fn) > 64:
                   l = 64 - len(fn)
                   f = fn.split('-')
                   fn = '-'.join(f[1:])
                   if len(fn) > 64:
                      l = 64 - len(fn)
                      f = fn.split('.')
                      fn = f[0][0:l] + '.' + f[-1]
                fn = fn[:-4]+'.eml'
                res['res_model'] = model
                res['name'] = msg.get('subject','NO-SUBJECT')+".eml"
                res['datas_fname'] = fn
                res['datas'] = base64.b64encode(mail.encode('utf-8'))
                res['res_id'] = res_id
                obj_attch.create(cr, uid, res)
            server_tools_pool.history_message(cr, uid, model, res_id, msg_new)
            res_ids.append(res_id)
        return len(res_ids)

    def process_email(self, cr, uid, vals):
        dictcreate = dict(vals)
        model = str(dictcreate.get('model'))
        message = dictcreate.get('message')
        return self.pool.get('email.server.tools').process_email(cr, uid, model, message, attach=True, context=None)

    def search_message(self, cr, uid, message, context=None):
        #@param message: string of mail which is read from EML File
        #@return model,res_id
        references = []
        dictcreate = dict(message)
        msg = dictcreate.get('message')
        msg = self.pool.get('email.server.tools').parse_message(msg)
        message_id = msg.get('message-id')
        refs =  msg.get('references',False)
        references = False
        if refs:
            references = refs.split()
        msg_pool = self.pool.get('mail.message')
        model = ''
        res_id = 0
        if message_id:
            msg_ids = msg_pool.search(cr, uid, [('message_id','=',message_id)])
            if msg_ids and len(msg_ids):
                msg = msg_pool.browse(cr, uid, msg_ids[0])
                model = msg.model
                res_id = msg.res_id
            else:
                if references :
                    msg_ids = msg_pool.search(cr, uid, [('message_id','in',references)])
                    if msg_ids and len(msg_ids):
                        msg = msg_pool.browse(cr, uid, msg_ids[0])
                        model = msg.model
                        res_id = msg.res_id
        return (model,res_id)


    def search_contact(self, cr, user, email):
        address_pool = self.pool.get('res.partner.address')
        address_ids = address_pool.search(cr, user, [('email','=',email)])
        res = {}

        if not address_ids:
            res = {
                'email': '',
            }
        else:
            address_id = address_ids[0]
            address = address_pool.browse(cr, user, address_id)
            res = {
                'partner_name': address.partner_id and address.partner_id.name or '',
                'contactname': address.name,
                'street': address.street or '',
                'street2': address.street2 or '',
                'zip': address.zip or '',
                'city': address.city or '',
                'country': address.country_id and address.country_id.name or '',
                'state': address.state_id and address.state_id.name or '',
                'email': address.email or '',
                'phone': address.phone or '',
                'mobile': address.mobile or '',
                'fax': address.fax or '',
                'partner_id': address.partner_id and str(address.partner_id.id) or '',
                'res_id': str(address.id),
            }
        return res.items()

    def update_contact(self, cr, user, vals):
        dictcreate = dict(vals)
        res_id = dictcreate.get('res_id',False)
        result = {}
        address_pool = self.pool.get('res.partner.address')
        if not (dictcreate.get('partner_id')): # TOCHECK: It should be check res_id or not
            dictcreate.update({'partner_id': False})
            create_id = address_pool.create(cr, user, dictcreate)
            return create_id

        if res_id:
            address_data = address_pool.read(cr, user, int(res_id), [])
            result = {
               'partner_id': address_data['partner_id'] and address_data['partner_id'][0] or False, #TOFIX: parter_id should take from address_data
               'country_id': dictcreate['country_id'] and int(dictcreate['country_id'][0]) or False,
               'state_id': dictcreate['state_id'] and int(dictcreate['state_id'][0]) or False,
               'name': dictcreate['name'],
               'street': dictcreate['street'],
               'street2': dictcreate['street2'],
               'zip': dictcreate['zip'],
               'city': dictcreate['city'],
               'phone': dictcreate['phone'],
               'fax': dictcreate['fax'],
               'mobile': dictcreate['mobile'],
               'email': dictcreate['email'],
            }
        address_pool.write(cr, user, int(res_id), result )
        return True

    def create_partner(self,cr,user,vals):
        dictcreate = dict(vals)
        partner_obj = self.pool.get('res.partner')
        search_id =  partner_obj.search(cr, user,[('name','=',dictcreate['name'])])
        if search_id:
            return 0
        create_id =  partner_obj.create(cr, user, dictcreate)
        return create_id

    def search_document(self,cr,user,vals):
        dictcreate = dict(vals)
        search_id = self.pool.get('ir.model').search(cr, user,[('model','=',dictcreate['model'])])
        return (search_id and search_id[0]) or 0

    def search_checkbox(self,cr,user,vals):
        if vals[0]:
            value = vals[0][0]
        if vals[1]:
            obj = vals[1];
        name_get=[]
        er_val=[]
        for object in obj:
            dyn_object = self.pool.get(object)
            if object == 'res.partner.address':
                search_id1 = dyn_object.search(cr,user,[('name','ilike',value)])
                search_id2 = dyn_object.search(cr,user,[('email','=',value)])
                if search_id1:
                    name_get.append(object)
                    name_get.append(dyn_object.name_get(cr, user, search_id1))
                elif search_id2:
                    name_get.append(object)
                    name_get.append(dyn_object.name_get(cr, user, search_id2))
            else:
                try:
                    search_id1 = dyn_object.search(cr,user,[('name','ilike',value)])
                    if search_id1:
                        name_get.append(object)
                        name_get.append(dyn_object.name_get(cr, user, search_id1))
                except:
                    er_val.append(object)
                    continue
        if len(er_val) > 0:
            name_get.append('error')
            name_get.append(er_val)
        return name_get
    def list_alldocument(self,cr,user,vals):
        obj_list= [('crm.lead','CRM Lead'),('project.issue','Project Issue'), ('hr.applicant','HR Applicant')]
        object=[]
        model_obj = self.pool.get('ir.model')
        for obj in obj_list:
            if model_obj.search(cr, user, [('model', '=', obj[0])]):
                object.append(obj)
        return object

    def list_allcountry(self,cr,user,vals):
        country_list = []
        cr.execute("SELECT id, name from res_country order by name")
        country_list = cr.fetchall()
        return country_list


    def list_allstate(self,cr,user,vals):
         cr.execute("select id, name  from res_country_state  where country_id = %s order by name",(vals,) )
         state_country_list = cr.fetchall()
         return state_country_list


    def search_document_attachment(self,cr,user,vals):
        model_obj = self.pool.get('ir.model')
        object=''
        for obj in vals[0][1].split(','):
            if model_obj.search(cr, user, [('model', '=', obj)]):
                object += obj + ","
            else:
                object += "null,"
        return object
    
    
    def meeting_push(self,cr,uid,vals):
        
        vals_dict = dict(vals)
        context = {}
        print "VA_LS __________-",vals_dict
        cal_pool = self.pool.get('crm.meeting')
        obj_name = vals_dict['ref_ids'].split(',')[0]
        if vals_dict['ref_ids'].split(',') and len(vals_dict['ref_ids'].split(',')) > 1:
            obj_id = vals_dict['ref_ids'].split(',')[1]
        else:
             obj_id = False
        if not obj_name and not obj_id:
            meeting_ids=cal_pool.import_cal(cr,uid,vals_dict['message'],context=context)
        else:
            obj_dict = {'crm.lead':'default_opportunity_id','res.partner':'default_partner_id'}
            context[obj_dict[obj_name]]=int(obj_id)
            if obj_name == 'crm.lead':
                partner_id = self.pool.get('crm.lead').browse(cr,uid,int(obj_id)).partner_id.id or False
                context.update({'default_partner_id':partner_id})
            meeting_ids=cal_pool.import_cal(cr,uid,vals_dict['message'],context=context)
        return True
    
    def check_calendar_existance(self,cr,uid,vals):
        print "VALST_T_T_T_T_T_T_T_T_T_T_",vals
        if not vals:
            return False
        else:
            pass
        self_ids = self.pool.get('crm.meeting').search(cr,uid,[('ext_meeting_id','=',vals)])
        if self_ids:
            self.meeting_push(cr, uid, vals)
        else:
            return False
        
zimbra_partner()


class crm_meeting(osv.osv):
    _inherit = 'crm.meeting'
    _columns = {
                'ext_meeting_id':fields.char('External Meeting ID',size=256)
                }
    
    
    def uid2openobjectid(self,cr, uidval, oomodel, rdate):
        """ UID To Open Object Id
            @param cr: the current row, from the database cursor,
            @param uidval: Get USerId vale
            @oomodel: Open Object ModelName
            @param rdate: Get Recurrent Date
        """
        __rege = re.compile(r'OpenObject-([\w|\.]+)_([0-9]+)@(\w+)$')
        if not uidval:
            return (False, None)
        wematch = __rege.match(uidval.encode('utf8'))
        if not wematch:
            if oomodel:
                model_obj = pooler.get_pool(cr.dbname).get(oomodel)
                sql = "SELECT DISTINCT(id) FROM "+model_obj._table+" where ext_meeting_id ilike '"+uidval+"'"
                cr.execute(sql)
                ex_id = cr.fetchone()
                if ex_id:
                    return (ex_id[0],None)
                else:
                    return (False, None)
            else:
                return (False, None)
        else:
            model, id, dbname = wematch.groups()
            model_obj = pooler.get_pool(cr.dbname).get(model)
            if (not model == oomodel) or (not dbname == cr.dbname):
                return (False, None)
            qry = 'SELECT DISTINCT(id) FROM %s' % model_obj._table
            if rdate:
                qry += " WHERE recurrent_id=%s"
                cr.execute(qry, (rdate,))
                r_id = cr.fetchone()
                if r_id:
                    return (id, r_id[0])
                else:
                    return (False, None)
            cr.execute(qry)
            ids = map(lambda x: str(x[0]), cr.fetchall())
            if id in ids:
                return (id, None)
            return (False, None)

    
    
    def import_cal(self, cr, uid, data, data_id=None, context=None):
        """
            @param self: The object pointer
            @param cr: the current row, from the database cursor,
            @param uid: the current user’s ID for security checks,
            @param data: Get Data of CRM Meetings
            @param data_id: calendar's Id
            @param context: A standard dictionary for contextual values
        """
        if context is None:
            context= {}
        event_obj = self.pool.get('basic.calendar.event')
        context.update({'model':'crm.meeting'})
        vals = event_obj.import_cal(cr, uid, data, context=context)
        return self.check_import(cr, uid, vals, context=context)

    def check_import(self, cr, uid, vals, context=None):
        """
            @param self: The object pointer
            @param cr: the current row, from the database cursor,
            @param uid: the current user’s ID for security checks,
            @param vals: Get Values
            @param context: A standard dictionary for contextual values
        """
        if context is None:
            context = {}
        ids = []
        model_obj = self.pool.get(context.get('model'))
        recur_pool = {}
        try:
            for val in vals:
                # Compute value of duration
                if val.get('date_deadline', False) and 'duration' not in val:
                    start = datetime.strptime(val['date'], '%Y-%m-%d %H:%M:%S')
                    end = datetime.strptime(val['date_deadline'], '%Y-%m-%d %H:%M:%S')
                    diff = end - start
                    val['duration'] = (diff.seconds/float(86400) + diff.days) * 24
                exists, r_id = self.uid2openobjectid(cr, val['id'], context.get('model'), \
                                                                 val.get('recurrent_id'))
                if val.has_key('create_date'):
                    val.pop('create_date')
                u_id = val.get('id', None)
                val.pop('id')
                if exists and r_id:
                    val.update({'recurrent_uid': exists})
                    model_obj.write(cr, uid, [r_id], val,context=context)
                    ids.append(r_id)
                elif exists:
                    model_obj.write(cr, uid, [exists], val)
                    ids.append(exists)
                else:
                    if u_id in recur_pool and val.get('recurrent_id'):
                        val.update({'recurrent_uid': recur_pool[u_id]})
                        val.update({'ext_meeting_id':u_id})
                        revent_id = model_obj.create(cr, uid, val,context=context)
                        ids.append(revent_id)
                    else:
                        __rege = re.compile(r'OpenObject-([\w|\.]+)_([0-9]+)@(\w+)$')
                        wematch = __rege.match(u_id.encode('utf8'))
                        if wematch:
                            model, recur_id, dbname = wematch.groups()
                            val.update({'recurrent_uid': recur_id})
                        val.update({'ext_meeting_id':u_id})
                        event_id = model_obj.create(cr, uid, val,context=context)
                        recur_pool[u_id] = event_id
                        ids.append(event_id)
        except Exception:
            raise
        return ids

    def check_calendar_existance(self,cr,uid,ids,data):
        if data:
            self_ids =  self.search(cr,uid,[('ext_meeting_id','=',data)])
        return True
    
crm_meeting()
