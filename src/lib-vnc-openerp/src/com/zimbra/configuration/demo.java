import java.io.*;
public class demo
{
	public static void main(String args[])
	{
		String clist[];
		String str;
		try
		{
			//	DataInputStream dis=new DataInputStream(new FileInputStream("contactFields.properties"));
			BufferedReader br=new BufferedReader(new FileReader("contactFields.properties"));
			System.out.println("this is reading from file..");
			str=br.readLine();
			while(str!=null)
			{
				clist=str.split("=");
				System.out.println("--------------- > field Name:"+clist[0].trim());
				str=br.readLine();
				if(str==null)
					break;
				System.out.println("--------------- > field Name:"+clist[0].trim());

			}
			System.out.println("this is end of file..");
		}
		catch(Exception e)
		{

		}
	}
}
