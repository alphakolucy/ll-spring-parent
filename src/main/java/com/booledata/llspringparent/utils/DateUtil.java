package com.booledata.llspringparent.utils;


import org.apache.commons.lang3.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DateUtil {


    public static Date transferDateFormat(String oldDateStr) {
        if (StringUtils.isBlank(oldDateStr)){
            return null;
        }
        Date date = null;
        Date date1 = null;
        String dateStr = null;
        try {
//            dateStr = oldDateStr.replace("Z", " UTC");//是空格+UTC
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            date1 = df.parse(dateStr);
            SimpleDateFormat df1 = new SimpleDateFormat ("EEE MMM dd HH:mm:ss Z yyyy", Locale.UK);
            date = df1.parse(date1.toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }
}
