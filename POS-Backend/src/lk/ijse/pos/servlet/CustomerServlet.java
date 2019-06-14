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

@WebServlet(urlPatterns = "/customer/*")
public class CustomerServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream inputStream = req.getInputStream();
        JsonReader reader = Json.createReader(inputStream);
        JsonObject customer = reader.readObject();

        String custId = customer.getString("custId");
        String custName = customer.getString("custName");
        String custAddress = customer.getString("custAddress");

        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO Customer VALUES (?,?,?)");
            preparedStatement.setObject(1, custId);
            preparedStatement.setObject(2, custName);
            preparedStatement.setObject(3, custAddress);

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
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        if (pathInfo == null) {
            BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = null;

            try {
                connection = dbpool.getConnection();
                PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Customer");
                ResultSet resultSet = preparedStatement.executeQuery();

                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                while (resultSet.next()) {
                    String custId = resultSet.getString(1);
                    String custName = resultSet.getString(2);
                    String custAddress = resultSet.getString(3);
                    arrayBuilder.add(Json.createObjectBuilder()
                            .add("custId", custId)
                            .add("custName", custName)
                            .add("custAddress", custAddress)
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
        } else {
            BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = null;

            try {
                connection = dbpool.getConnection();
                PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Customer WHERE custID=" + pathInfo);
                ResultSet resultSet = preparedStatement.executeQuery();

                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                while (resultSet.next()) {
                    String custId = resultSet.getString(1);
                    String custName = resultSet.getString(2);
                    String custAddress = resultSet.getString(3);
                    arrayBuilder.add(Json.createObjectBuilder()
                            .add("custId", custId)
                            .add("custName", custName)
                            .add("custAddress", custAddress)
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

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String custId = pathInfo.substring(1);
        if (pathInfo != null) {
            ServletInputStream inputStream = req.getInputStream();
            JsonReader reader = Json.createReader(inputStream);
            JsonObject customer = reader.readObject();

            String custName = customer.getString("custName");
            String custAddress = customer.getString("custAddress");

            BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = null;
            PrintWriter out = resp.getWriter();
            try {
                connection = dbpool.getConnection();
                PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Customer SET custName=?,custAddress=? WHERE custID=?");
                preparedStatement.setObject(1, custId);
                preparedStatement.setObject(2, custName);
                preparedStatement.setObject(3, custAddress);

                boolean result = preparedStatement.executeUpdate() < 0;

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
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream inputStream = req.getInputStream();
        JsonReader reader = Json.createReader(inputStream);
        JsonObject customer = reader.readObject();

        String custId = customer.getString("custID");

        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM Customer where custID='" + custId  +"'");

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
}
