package com.booledata.llspringparent.utils.tools;

import org.springframework.beans.BeanUtils;

import java.io.*;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 用于JPA更新时，拷贝对象之间的不为空的值
 *
 * @param <T>
 */
public class ObjectCopyUtil<T> {
    /**
     * 把t1对象里不为空的数据拷贝给t2,t2最终提交数据库
     *
     * @param t1
     * @param t2
     */
    public void copyProperties(final T t1, final T t2) {
        List<String> ignoreFieldList = new ArrayList<>();
        @SuppressWarnings("rawtypes")
        Class clazz = t1.getClass();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);  //启用访问控制权限
            try {
                //拿到对象实例(t1)的 域成员的值
                if(null == field.get(t1)
                        || (Collection.class.isAssignableFrom(field.getType())
                        && ((Collection)field.get(t1)).size()<=0)){
                    //为null值的字段或者集合size为0的加入忽略字段列表
                    ignoreFieldList.add(field.getName());
                }
            } catch (IllegalArgumentException | IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        String[] ignoreFieldArray = (String[]) ignoreFieldList.toArray(new String[ignoreFieldList.size()]);
        BeanUtils.copyProperties(t1, t2, ignoreFieldArray);
    }

    /**
     * 深度复制，实参类必须实现Serializable接口
     *
     * @param o
     * @return
     * @throws IOException
     * @throws ClassNotFoundException
     */
    public static Object deepCopy(Object o) throws IOException, ClassNotFoundException {
        //先序列化，写入到流里
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        ObjectOutputStream oo = new ObjectOutputStream(bo);
        oo.writeObject(o);
        //然后反序列化，从流里读取出来，即完成复制
        ByteArrayInputStream bi = new ByteArrayInputStream(bo.toByteArray());
        ObjectInputStream oi = new ObjectInputStream(bi);
        return oi.readObject();
    }

}
