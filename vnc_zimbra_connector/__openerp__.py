# -*- encoding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>). All Rights Reserved
#    Copyright (c) 2004 Axelor SPRL. (http://www.axelor.com) All Rights Reserved.
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
{
    "name" : "Zimbra Interface",
    "version" : "1.0",
    "author" : "OpenERP SA & Axelor",
    "website" : "http://www.openerp.com/",
    "depends" : ["base","mail_gateway","crm_caldav"],
    "category" : "Generic Modules/Zimbra interface",
    "description": """
      This module is required for the thuderbird plug-in to work
      properly.
      The Plugin allows you archive email and its attachments to the selected 
      OpenERP objects. You can select a partner, a task, a project, an analytical
      account,or any other object and attach selected mail as eml file in 
      attachment of selected record. You can create Documents for crm Lead,
      HR Applicant and project issue from selected mails.

      """,
    "init_xml" : [],
    "demo_xml" : [],
    "update_xml" : [
                    'security/ir.model.access.csv'
                    ],
    "active": False,
    "installable": True,
#    "certificate" : "00899858104035139949",
}
