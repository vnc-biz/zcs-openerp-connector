<%@ page import="java.util.*,com.zimbra.configuration.*" %>
        <%

                try {
                        String dbname=request.getParameter("dbname");
                        String password=request.getParameter("password");
			String urladdress=request.getParameter("urladdress");
			String port=request.getParameter("port");
                        String obj_name=request.getParameter("obj_name");

                        ErpConfiguration configuration=new ErpConfiguration();
                        out.println(configuration.checkRecords(dbname,password,urladdress,port,obj_name));


                } catch (Exception e) {
                        out.println(e.getMessage());
                }
        %>
