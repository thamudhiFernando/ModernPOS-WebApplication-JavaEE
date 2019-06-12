package lk.ijse.pos;

import org.apache.commons.dbcp2.BasicDataSource;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class ContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        BasicDataSource bdc = new BasicDataSource();
        bdc.setDriverClassName("com.mysql.jdbc.Driver");
        bdc.setUsername("root");
        bdc.setPassword("mysql");
        bdc.setUrl("jdbc:mysql://localhost:3306/TestJPA");

        bdc.setInitialSize(10);
        bdc.setMaxTotal(10);
        bdc.setMaxIdle(10);

        sce.getServletContext().setAttribute("dbpool",bdc);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}
