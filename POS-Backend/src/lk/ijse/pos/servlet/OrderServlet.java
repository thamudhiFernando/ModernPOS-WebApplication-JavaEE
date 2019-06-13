package lk.ijse.pos.servlet;

import org.apache.commons.dbcp2.BasicDataSource;

import javax.json.Json;
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
import java.sql.SQLException;

@WebServlet(urlPatterns = "/order")
public class OrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletInputStream inputStream = req.getInputStream();
        JsonReader reader = Json.createReader(inputStream);
        JsonObject order = reader.readObject();

        String orderid = order.getString("orderid");
        String orderdate = order.getString("orderdate");
        String orderamount = order.getString("orderamount");
        String custid = order.getString("custid");
        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            connection.setAutoCommit(true);
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO Orders VALUES (?,?,?,?)");
            preparedStatement.setObject(1, orderid);
            preparedStatement.setObject(2, orderdate);
            preparedStatement.setObject(3, orderamount);
            preparedStatement.setObject(4, custid);

            boolean result = preparedStatement.executeUpdate() > 0;

            if (result) {
                connection.commit();
                out.println("true");
            } else {
                connection.rollback();
                out.println("false");
            }
        } catch (SQLException e) {
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
