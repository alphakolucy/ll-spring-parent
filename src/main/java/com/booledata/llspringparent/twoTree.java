package com.booledata.llspringparent;

import javax.swing.tree.TreeNode;
import java.util.Enumeration;

public class twoTree {



    public  static void mirrorTree(TreeNode root)
    {
        if(root==null) {
            return;
        }
        //交换该节点指向的左右节点。
        Enumeration children = root.children();
        String s = children.nextElement().toString();
        System.out.println("s:"+s);
        //对其左右孩子进行镜像处理。
    }


    public static void main(String[] args) {
        TreeNode treeNode =null;
    }
}
