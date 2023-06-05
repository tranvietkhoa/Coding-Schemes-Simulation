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

struct Polynomial {
    vector<int> coefficient = {0,0,0,0,0,0,0}; //convention: coefficient[i] to x^i
};

void printPol(Polynomial p) {
    cout << "polynomial: ";
    for (int i = 0; i < n; i++) {
        cout << p.coefficient[i] << ' ';
    }
    cout << endl;
}

vector<int> exptable; // Khoa
vector<int> logtable; // Khoa

Polynomial gx;
void buildGx() {
    gx.coefficient = {522, 568, 723, 809, 1, 0, 0};
}

Polynomial add(Polynomial p1, Polynomial p2) {
    Polynomial p3;
    for (int i = 0; i < n; i++){
        p3.coefficient[i] = (p1.coefficient[i] + p2.coefficient[i]) % field_size;
    }
    return p3;
}

Polynomial mul(Polynomial p1, Polynomial p2) { //Nguyen
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

vector<int> gauss() { //Nguyen
    vector<int> res;
    return res;
}

pair<int,int> quadraticEqnSol(int a, int b, int c) { //Nguyen
    pair<int,int> res;
    return res;
}

int Forney() { //Khoa
    return -1;
}

void test() {
    for (auto x : gx.coefficient) cout << x << ' ';
}

int main() {
    buildGx();
    // test();
    Polynomial x;
    x.coefficient = {0, 0, 0, 0, 1, 0, 0};
    Polynomial p;
    p.coefficient = {1, 2, 3, 0, 0, 0, 0};
    Polynomial result = moduloGx(mul(x, p));
    printPol(result);
    return 0;
}
