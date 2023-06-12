// (7,3) Reed-Solomon Code on GF(929).

/*
Resources: 
1, Gaussian elimination: https://cp-algorithms.com/linear_algebra/linear-system-gauss.html#degenerate-cases
2, PGZ and Forney: https://web.archive.org/web/20140630172526/http://web.stanford.edu/class/ee387/handouts/notes7.pdf
*/


#include <iostream>
#include <vector>

using namespace std;

#define primitive_element 3
#define field_size 929
#define n 7
#define k 3
#define s 2
#define gxDeg 4

/**
 * Define the polynomial. In this problem, polynomials are of highest degree n - 1
 * The i-th value of the coefficient array corresponds to the coefficient of x^i in the polynomial
 * @author Khoa
 */
struct Polynomial {
    vector<int> coefficient = {0,0,0,0,0,0,0};
};

/**
 * Print polynomial with coefficients separated by a space.
 * @param p the polynomial to print
 * @author Nguyen
 */
void printPol(Polynomial p) {
    cout << "polynomial: ";
    for (int i = 0; i < n; i++) {
        cout << p.coefficient[i] << ' ';
    }
    cout << endl;
}

/**
 * Print vector of integers, each value separated by a space.
 * @param vec the array to print
 * @param count the number of elements in the array
 * @author Nguyen
 */
void printVec(vector<int> vec, int count) {
    cout << "numbers: ";
    for (int i = 0; i < count; i++) {
        cout << vec[i] << ' ';
    }
    cout << endl;
}

/**
 * Print matrix, each row is on a new line, and each pair of successive values within a row are separated by a space.
 * @param mat the matrix to print
 * @param r the number of rows of the matrix
 * @param c the number of columns of the matrix
 * @author Nguyen
 */
void printMat(vector<vector<int>> mat, int r, int c) {
    cout << "matrix: " << endl;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            cout << mat[i][j] << ' ';
        }
        cout << endl;
    }
}

vector<int> exptable(field_size - 1); 
vector<int> logtable(field_size - 1); 

/**
 * Construct the exponential array and the log array,
 * Where the i-th value of the exponential array is alpha^i % field_size, where alpha is the primitive element of the field,
 * and the i-th value of the log array is the number x such that alpha^x % field_size = i.
 * Here i is 1-indexed.
 * @author Nguyen
 */
void buildExpLogTable() {
    int curr = primitive_element;
    for (int i = 0; i < field_size - 1; i++) {
        exptable[i] = curr;
        logtable[curr - 1] = i + 1;
        curr = (curr * primitive_element) % field_size;
    }
}

/**
 * Calculate f(a)
 * @author Khoa
 */
int eval_fx_at(Polynomial fx, int a){
    int res = 0, tem;
    for (int i = 0; i < n; i++){
        tem = fx.coefficient[i];
        for (int j = 0; j < i; j ++){
            tem *= a;
            tem %= field_size;
        }
        res += tem;
        res %= field_size;
    }
    return res;
} 

Polynomial gx;
/**
 * Construct the polynomial g(x), the generator polynomial of the field.
 * @author Khoa
 */
void buildGx() {
    gx.coefficient = {522, 568, 723, 809, 1, 0, 0};
}

/**
 * Perform polynomial addition, assuming that the degree of each polynomial is at most n
 * @param p1 the first polynomial
 * @param p2 the second polynomial
 * @return the addition of the two polynomials
 * @author Khoa
 */
Polynomial add(Polynomial p1, Polynomial p2) {
    Polynomial p3;
    for (int i = 0; i < n; i++){
        p3.coefficient[i] = (p1.coefficient[i] + p2.coefficient[i]) % field_size;
    }
    return p3;
}

/**
 * Given two polynomials p1 and p2, derive the multiplication of the two polynomials.
 * Assume that the degree of the product polynomial does not exceed the allowable degree n.
 * The coefficients are taken modulo field_size.
 * @param p1 the first polynomial
 * @param p2 the second polynomial
 * @return the product polynomial
 * @author Nguyen
 */
Polynomial mul(Polynomial p1, Polynomial p2) {
    Polynomial p3;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            p3.coefficient[i] += p1.coefficient[j] * p2.coefficient[i - j];
        }
        // for (int j = i + 1; j < n; j++) {
        //     p3.coefficient[i] += p1.coefficient[j] * p2.coefficient[n - j + i];
        // }
        p3.coefficient[i] %= field_size;
    }
    return p3;
}

/**
 * Assume that g(x) highest coefficient is 1, determine p1(x) mod g(x).
 * @param p1 the polynomial to take modulo
 * @return polynomial as a result of the modulo
 * @author Nguyen
 */
Polynomial moduloGx(Polynomial p1) {
    int highestP1Deg = n - 1;
    while (p1.coefficient[highestP1Deg] == 0 && highestP1Deg > 0) {
        highestP1Deg--;
    }
    if (highestP1Deg < gxDeg) {
        return p1;
    }

    Polynomial result;
    for (int i = 0; i <= highestP1Deg; i++) {
        result.coefficient[i] = p1.coefficient[i];
    }

    int highestCoefficient = 0;
    for (int i = highestP1Deg; i >= gxDeg; i--) {
        highestCoefficient = result.coefficient[i];
        for (int j = 0; j <= gxDeg; j++) {
            result.coefficient[i - j] = (result.coefficient[i - j] - highestCoefficient * gx.coefficient[gxDeg - j]) % field_size;
        }
    }
    return result;
}


/**
 * Given two numbers a and c, find b such that a * b = c (mod field_size)
 * Assume that 0 <= a, c < field_size
 * @param a the first number a
 * @param c the second number c
 * @return the value of b that satisfies the modulo equation
 * @author Nguyen
 */
int findB(int a, int c) {
    int b = 0;
    while (a * b % field_size != c) {
        b++;
    }
    return b;
}


/**
 * Given the set of errors S1, S2, ... , S(2v - 1), find the coefficients of error locator A1, A2, ..., Av
 * Assume -field_size < S[i] < field_size
 * @param S the array of errors S1, S2, ..., S(2v - 1)
 * @param v the coefficient v, the degree of error locator
 * @return the error locator
 * @author Nguyen
 */
vector<int> gauss(vector<int> S) { 
    vector<vector<int>> A(s, vector<int>(s + 1));
    // assign the entries of A
    for (int i = 0; i < s; i++) {
        for (int j = 0; j < s; j++) {
            A[i][j] = S[i + j];
            if (A[i][j] < 0) {
                A[i][j] += field_size;
            }
        }
    }
    for (int i = 0; i < s; i++) {
        A[i][s] = -S[i + s];
        if (A[i][s] < 0) {
            A[i][s] += field_size;
        }
    }

    // obtain RREF of A
    int constant;
    for (int i = 0; i < s; i++) {
        for (int j = 0; j < s; j++) {
            if (j != i) {
                constant = findB(A[i][i], A[j][i]);
                for (int l = i; l <= s; l++) {
                    A[j][l] = (A[j][l] - ((A[i][l] * constant) % field_size)) % field_size;
                    if (A[j][l] < 0) {
                        A[j][l] += field_size;
                    }
                }
            }
        }
    }

    // extract result from RREF
    vector<int> result(s);
    for (int i = 0; i < s; i++) {
        result[i] = findB(A[i][i], A[i][s]);
    }
    return result;
}

/**
 * Given the coefficients of quadratic equation modulo n, find the pair of solutions.
 * a x^2 + b x + c = 0 (mod field_size)
 * @param a coefficient a
 * @param b coefficient b
 * @param c coefficient c
 */
pair<int,int> quadraticEqnSol(int a, int b, int c) { 
    pair<int,int> res;
    int numOfSolFound = 0;
    for (int i = 0; i < field_size - 1; i++) {
        if ((a * exptable[(2 * (i + 1)) % (field_size - 1) - 1] + b * exptable[i] + c) % field_size == 0) {
            if (numOfSolFound == 0) {
                res.first = exptable[i];
                numOfSolFound++;
            } else {
                res.second = exptable[i];
                break;
            }
        }
    }
    return res;
}

void encode(){
    // to be completed
}

void decode(){
    // to be completed
}

void test() {
    
    Polynomial x;
    x.coefficient = {0, 0, 0, 0, 0, 0, 6};
    cout << eval_fx_at(x, 12) << endl;
    
    cout << 12*12*12*12*12*12 % field_size << endl;
    
    Polynomial p;
    p.coefficient = {1, 2, 3, 0, 0, 0, 0};
    Polynomial BPol = moduloGx(mul(x, p));
    //printPol(BPol);
    
    vector<int> Sarr = {732, 637, 762, 925};
    vector<int> errorLocator = gauss(Sarr);
    //printVec(errorLocator, 2);

    //constructExpLogTable();
    // printVec(exptable, field_size - 1);
    // printVec(logtable, field_size - 1);

    pair<int, int> quadSol = quadraticEqnSol(329, 821, 1);
    //cout << "quadratic eqn sol: " << quadSol.first << " " << quadSol.second << endl;
    
}

int main() {
    buildGx();
    buildExpLogTable();
    // test();
    encode();
    decode();
    return 0;
}
