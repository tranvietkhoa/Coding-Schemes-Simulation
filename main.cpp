// (7,3) Reed-Solomon Code on GF(929).

#include <iostream>
#include <vector>

using namespace std;

#define primitive_element 3
#define field_size 929

struct Polynomial{
    vector<int> coefficient = {0,0,0,0,0,0,0}; //convention: coefficient[i] to x^i
};

vector<int> exptable; // Khoa
vector<int> logtable; // Khoa

Polynomial gx;
void build_gx(){
    gx.coefficient = {522, 568, 723, 809, 1, 0, 0};
}

Polynomial add(Polynomial p1, Polynomial p2){
    Polynomial p3;
    for (int i=0; i<7; i++){
        p3.coefficient[i] = (p1.coefficient[i] + p2.coefficient[i]) % field_size;
    }
    return p3;
}

Polynomial mul(Polynomial p1, Polynomial p2){ //Nguyen
    Polynomial p3;
    return p3;
}

Polynomial modulo_gx(Polynomial p1){ //Nguyen
    Polynomial p3;
    return p3;
}

vector<int> gauss(){ //Nguyen
    vector<int> res;
    return res;
}

pair<int,int> quadratic_eqn_sol(int a, int b, int c){ //Nguyen
    pair<int,int> res;
    return res;
}

int Forney(){ //Khoa
    return -1;
}

void test(){
    for (auto x : gx.coefficient) cout << x << ' ';
}

int main() {
    build_gx();
    test();
    return 0;
}
