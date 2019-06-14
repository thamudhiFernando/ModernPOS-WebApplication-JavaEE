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

@WebServlet(urlPatterns = "/item/*")
public class ItemServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ServletInputStream inputStream = req.getInputStream();
        JsonReader reader = Json.createReader(inputStream);
        JsonObject item = reader.readObject();

        String code = item.getString("code");
        String description = item.getString("description");
        String orderqty = item.getString("orderqty");
        String unitPrice = item.getString("unitPrice");

        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO Item VALUES (?,?,?,?)");
            preparedStatement.setObject(1, code);
            preparedStatement.setObject(2, description);
            preparedStatement.setObject(3, orderqty);
            preparedStatement.setObject(4, unitPrice);

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
                PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Item");
                ResultSet resultSet = preparedStatement.executeQuery();

                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                while (resultSet.next()) {
                    String code = resultSet.getString(1);
                    String description = resultSet.getString(2);
                    int orderqty = resultSet.getInt(3);
                    double unitprice = resultSet.getDouble(4);

                    arrayBuilder.add(Json.createObjectBuilder()
                            .add("code", code)
                            .add("description", description)
                            .add("orderqty", orderqty)
                            .add("unitPrice", unitprice)
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
                PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Item WHERE code=" + pathInfo);
                ResultSet resultSet = preparedStatement.executeQuery();

                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                while (resultSet.next()) {
                    String code = resultSet.getString(1);
                    String description = resultSet.getString(2);
                    int orderqty = resultSet.getInt(3);
                    double unitprice = resultSet.getDouble(4);
                    arrayBuilder.add(Json.createObjectBuilder()
                            .add("code", code)
                            .add("description", description)
                            .add("orderqty", orderqty)
                            .add("unitprice", unitprice)
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
        resp.setContentType("application/json");
        String pathInfo = req.getPathInfo();
        String code = pathInfo.substring(1);

        if (pathInfo != null) {
            ServletInputStream inputStream = req.getInputStream();
            JsonReader reader = Json.createReader(inputStream);
            JsonObject item = reader.readObject();

            String description = item.getString("description");
            int qty = item.getInt("qty");
            double unitPrice = item.getInt("unitPrice");

            BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = null;
            PrintWriter out = resp.getWriter();
            try {
                connection = dbpool.getConnection();
                PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Item SET description=?,qty=?, unitPrice=? WHERE code=?");
                preparedStatement.setObject(1, code);
                preparedStatement.setObject(2, description);
                preparedStatement.setObject(3, qty);
                preparedStatement.setObject(4, unitPrice);

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
        JsonObject item = reader.readObject();

        String code = item.getString("code");

        BasicDataSource dbpool = (BasicDataSource) getServletContext().getAttribute("dbpool");
        Connection connection = null;
        PrintWriter out = resp.getWriter();
        try {
            connection = dbpool.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM Item where code='" + code  +"'");

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
