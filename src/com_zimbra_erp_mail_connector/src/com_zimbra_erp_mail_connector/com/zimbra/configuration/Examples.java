import java.io.*;
import java.sql.*;

public class Examples
{

	public static void main(String args[])
	{

		try
		{

			Class.forName("com.mysql.jdbc.Driver");
			/* Connection  con =DriverManager.getConnection("jdbc:mysql://localhost:7306/openERP_connector","","");
			         Statement stmt = con.createStatement();
			 String sql="select * from document_setting";
			         PreparedStatement prest = con.prepareStatement(sql);
			         ResultSet rs=prest.executeQuery();

			while(rs.next()){
				System.out.println("-->"+rs.getInt(1));
			}*/

		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}
