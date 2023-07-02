// (7,3) Reed-Solomon Code on GF(929).

/*
Resources:
1, Gaussian elimination: https://cp-algorithms.com/linear_algebra/linear-system-gauss.html#degenerate-cases
2, PGZ and Forney: https://web.archive.org/web/20140630172526/http://web.stanford.edu/class/ee387/handouts/notes7.pdf
*/

/*
Contributions:
1, Khoa:
2, Nguyen:
*/

#include <iostream>
#include <vector>

using namespace std;

#define primitive_element 3
#define field_size 929
#define n 7 // code size
#define k 3 // message size
#define s 2 // maximum number of errors
#define gxDeg 4

/**
 * Define the polynomial. In this problem, polynomials are of highest degree n - 1
 * The i-th value of the coefficient array corresponds to the coefficient of x^i in the polynomial
 * @author Khoa
 */
struct Polynomial {
    vector<int> coefficient = {0, 0, 0, 0, 0, 0, 0};
};

Polynomial msg;
Polynomial received;
Polynomial code;
Polynomial error;
Polynomial err_evaluator;
Polynomial err_locator;
Polynomial fm_derivative;
Polynomial partial_syndrome;

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

vector<int> exptable(field_size - 1); // exptable[i] returns 3^(i + 1)
vector<int> logtable(field_size - 1); // logtable[i] returns log3(i + 1)

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
 * Evaluates the values of f(x) at a. In other words f(a)
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
 * Perform polynomial subtraction, assuming that the degree of each polynomial is at most n
 * @param p1 the first polynomial
 * @param p2 the second polynomial
 * @return the addition of the two polynomials
 * @author Khoa
 */
Polynomial subtract(Polynomial p1, Polynomial p2) {
    Polynomial p3;
    for (int i = 0; i < n; i++){
        p3.coefficient[i] = (p1.coefficient[i] - p2.coefficient[i] + field_size) % field_size;
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
 * Assume that 0 < a, c < field_size
 * The case a = 0 has to be handled elsewhere, or else this function gives rise to infinite loop.
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

    int constant;
    for (int i = 0; i < s; i++) {
        // before doing row operation, check if current row pivot entry is 0
        if (A[i][i] == 0) {
            for (int i2 = i + 1; i2 < s; i2++) {
                if (A[i2][i] != 0) {
                    // swap rows
                    for (int l = 0; l <= s; l++) {
                        int temp = A[i][l];
                        A[i][l] = A[i2][l];
                        A[i2][l] = temp;
                    }
                    break;
                }
            }
        }

        // if did not manage to find a row with nonzero entry at the same spot, move on
        if (A[i][i] == 0) {
            continue;
        }

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

    vector<int> result(s);
    for (int i = 0; i < s; i++) {
        result[s-i-1] = findB(A[i][i], A[i][s]);
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

// builds S(x) (partial syndrome), Ω(x) = Λ(x)S(x) mod x^2s, and Λ'(x) respectively

void buildSx(){
    for (int i=0; i<2*s; i++){
        partial_syndrome.coefficient[i] = eval_fx_at(received, exptable[i]);
    }
}

void buildOhmx(){
    err_evaluator = mul(partial_syndrome, err_locator);
    for (int i = 2*s; i < n; i++){
        err_evaluator.coefficient[i] = 0;
    }
}

void buildfmdr(){
    for (int i = 0; i < n - 1; i++){
        fm_derivative.coefficient[i] = err_locator.coefficient[i+1] * (i + 1);
        fm_derivative.coefficient[i] %= field_size;
    }
}

// Forney algorithm for finding the error values. Parameters include x1 and x2 which are multiplicative inverses of 3^i where i is an error location. It returns the respective error values.

pair<int, int> Forney(int x1, int x2) {
    pair<int,int> res;
    for (int i = 0; i <= field_size; i++){
        if (((eval_fx_at(err_evaluator, x1) + (eval_fx_at(fm_derivative, x1) * i) % field_size) % field_size) == 0) {
            res.first = i;
            break;
        }
    }
    for (int i = 0; i <= field_size; i++){
        if (((eval_fx_at(err_evaluator, x2) + (eval_fx_at(fm_derivative, x2) * i) % field_size) % field_size) == 0) {
            res.second = i;
            break;
        }
    }
    return res;
}

void encode() {
    Polynomial message;
    cout << "Enter message to encode: ";
    for (int i = 0; i < k; i++) cin >> message.coefficient[i];

    Polynomial multiplier;
    multiplier.coefficient = {0, 0, 0, 0, 1, 0, 0};
    Polynomial multiplied = mul(message, multiplier);
    Polynomial remainder = moduloGx(multiplied);
    Polynomial encoded = subtract(multiplied, remainder);
    for (int i = 0; i < n; i++) {
        encoded.coefficient[i] = (encoded.coefficient[i] + 2 * field_size) % field_size;
    }

    cout << "Encoded message:         ";
    for (auto x:encoded.coefficient) cout << x << ' ';
    cout << endl;
}

void decode() {
    Polynomial originalCode; // we wish to recover the original code
    cout << "Enter the received code: ";
    for (int i = 0; i < n; i++) cin >> received.coefficient[i];
    
    vector<int> S(2*s); // S stores the values of the received polynomial at 3^r for r in [1:4]
    for (int i = 0; i < 2*s; i++){
        S[i] = eval_fx_at(received, exptable[i]);
    }
    
    vector<int> err_loc_coefficient(s);
    err_loc_coefficient = gauss(S); // calculate the coefficients of the error locator function
    err_locator.coefficient[0] = 1;
    
    for (int i = 1; i <= s; i++){
        err_locator.coefficient[i] = err_loc_coefficient[i-1];
    }
    
    pair<int,int> X;
    X = quadraticEqnSol(err_locator.coefficient[2], err_locator.coefficient[1], err_locator.coefficient[0]);
    // the solutions to Λ(x) = 0 are the multiplicative inverses of 3^i, in which i is an error location
    
    buildSx(); // S(x)
    buildOhmx(); // Ω(x)
    buildfmdr(); // S'(x)
    
    pair<int,int> location; // deducing the locations of error
    
    for (int i = 0; i <= field_size; i++){
        if ((i * X.first) % field_size == 1){
            location.first = logtable[i-1];
            break;
        }
    }
    
    for (int i = 0; i <= field_size; i++){
        if ((i * X.second) % field_size == 1){
            location.second = logtable[i-1];
            break;
        }
    }

    cout << location.first << ' ' << location.second << endl;
    
    pair<int,int> Y;
    Y = Forney(X.first, X.second); // values produced by Forney algorithm is the error size for each error location
    
    error.coefficient[location.first] = Y.first;
    error.coefficient[location.second] = Y.second;
    originalCode = subtract(received, error); // original code is obtained by subtracting the error polynomial from the received polynomial
    cout << "Correct code:            ";
    for (auto x : originalCode.coefficient) cout << x << ' ';
    cout << endl;
    
    cout << "Original message:        ";
    for (int i = 2*s; i < n; i++) cout << originalCode.coefficient[i] << ' ';
    cout << endl;
}

void test() {
    // printVec(exptable, field_size - 1);
    // printVec(logtable, field_size - 1);

    vector<int> errors = {706, 517, 72, 258};
    vector<int> result = gauss(errors);
    printVec(result, 2);
}

void run(){
    encode();
    cout << "---------------" << endl;
    decode();
}

int main() {
    buildGx();
    buildExpLogTable();
    // test();
    run();
    return 0;
}
