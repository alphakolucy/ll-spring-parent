package com.booledata.llspringparent.test;

import java.math.BigInteger;
import java.util.Scanner;



public class BigIntegerTest {


	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		System.out.println("enter your number");
		int k  = in.nextInt();
		System.out.println("enter your highest number");

		Integer n  = in.nextInt();
		BigInteger bigInteger = BigInteger.valueOf(1);


		for (int i = 1; i <=k; i++) {
			System.out.println(bigInteger.divide(BigInteger.valueOf(i)));
			bigInteger = bigInteger.multiply(BigInteger.valueOf(n - i + 1).divide(BigInteger.valueOf(i)));

		}
		System.out.println("your odds are 1 in "+bigInteger+",Good Luck" );
	}

}
