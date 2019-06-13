package lk.ijse.pos.servlet;

import org.apache.commons.dbcp2.BasicDataSource;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
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

@WebServlet(urlPatterns = "/orderdetail")
public class OrderDetailServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletInputStream inputStream = req.getInputStream();
        JsonReader reader = Json.createReader(inputStream);
        JsonObject orderdetail = reader.readObject();

        String orderid = orderdetail.getString("orderid");
        String code = orderdetail.getString("code");
        String orderqty = orderdetail.getString("orderqty");
        String amount = orderdetail.getString("amount");

        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO OrderDetail VALUES (?,?,?,?)");
            preparedStatement.setObject(1, orderid);
            preparedStatement.setObject(2, code);
            preparedStatement.setObject(3, orderqty);
            preparedStatement.setObject(4, amount);

            boolean result = preparedStatement.executeUpdate() > 0;

            if (result) {
                out.println("true");
            } else {
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

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();


        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;

        try {
            connection = dbpool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Orderdetail");
            ResultSet resultSet = preparedStatement.executeQuery();

            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
            while (resultSet.next()) {
                String orderid = resultSet.getString(1);
                String code = resultSet.getString(2);
                String orderqty = resultSet.getString(3);
                String amount = resultSet.getString(4);
                arrayBuilder.add(Json.createObjectBuilder()
                        .add("orderid", orderid)
                        .add("code", code)
                        .add("orderqty", orderqty)
                        .add("amount", amount)
                        .build()
                );
            }
            out.println(arrayBuilder.build().toString());
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

