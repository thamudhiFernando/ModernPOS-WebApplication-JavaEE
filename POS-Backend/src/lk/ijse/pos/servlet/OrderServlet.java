package lk.ijse.pos.servlet;

import org.apache.commons.dbcp2.BasicDataSource;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/order/*")
public class OrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletInputStream inputStream = req.getInputStream();
        JsonReader reader = Json.createReader(inputStream);
        JsonArray completeArray = reader.readArray();

        JsonArray jsonArray1 = completeArray.getJsonArray(0);
        JsonArray jsonArray2 = completeArray.getJsonArray(1);

        String orderid = jsonArray1.getString(0);
        String orderdate = jsonArray1.getString(1);
        String orderamount = String.valueOf(jsonArray1.getString(2));
        String custid = jsonArray1.getString(3);


        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            connection.setAutoCommit(false);
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO Orders VALUES (?,?,?,?)");
            preparedStatement.setString(1, orderid);
            preparedStatement.setString(2, orderdate);
            preparedStatement.setString(3, orderamount);
            preparedStatement.setString(4, custid);

            boolean orderResult = preparedStatement.executeUpdate() > 0;
            boolean orderDetailResult = false;

            for (int i=0;i<jsonArray2.size();i++) {
                JsonObject jsonObject = jsonArray2.getJsonObject(i);
                String code = jsonObject.getString("code");
                String orderqty = jsonObject.getString("orderqty");
                String amount = jsonObject.getString("amount");

                PreparedStatement preparedStatement1 = connection.prepareStatement("INSERT INTO OrderDetail VALUES (?,?,?,?)");
                preparedStatement1.setObject(1, orderid);
                preparedStatement1.setObject(2, code);
                preparedStatement1.setObject(3, orderqty);
                preparedStatement1.setObject(4, amount);

                orderDetailResult = preparedStatement1.executeUpdate() > 0;

                int oldqty=0;
                PreparedStatement selectStatement = connection.prepareStatement("select item.QtyOnHand from item where item.code=?");

                selectStatement.setString(1,code);
                ResultSet resultSet = selectStatement.executeQuery();
                if (resultSet.next()){
                    oldqty = resultSet.getInt(1);
                }

                PreparedStatement updateStatement = connection.prepareStatement("UPDATE item SET QtyOnHand=? where code=?");
                updateStatement.setString(1, String.valueOf(oldqty-Integer.parseInt(orderqty)));
                updateStatement.setString(2,code);
                updateStatement.executeUpdate();
            }


            if (orderResult) {
                if (orderDetailResult){
                    connection.commit();
                    connection.setAutoCommit(true);
                    out.println("true");
                }else {
                    connection.rollback();
                    out.println("false");
                }
            } else {
                connection.rollback();
                out.println("false");
            }
        } catch (SQLException e) {
            try {
                connection.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
