/*
Hamming Code simulator. Created by Viet-Khoa Tran.
 
Hamming Code can detect and correct single bit flips, and can detect double bit flips with an
extra parity bit. In this version, I only intend to produce Hamming codes that detect and
correct single bit flips.

How it works: r is a number of redundant bits required. The selection of r only affects the
number of bit required for your message. As this programme serves merely as an educational
tool, you are expected to enter the exact number of bits asked by the programme. In real life,
one can add extra don't-care bits which do not alter the meaning of the intended message.
 
Sender role: after entering r and the message, the programme will produce a Hamming code of
of length 2^r - 1. This will be sent to the receiver.

Receiver role: after entering r, you can pretend there is at most one bit flip occured to
your Hamming code. Fret not, the programme is designed to detect such an error and will
reproduce the original Hamming code and message.
 
More on Hamming Code: https://en.wikipedia.org/wiki/Hamming_code
 
Have fun learning!
*/

#include <iostream>
#include <vector>

using namespace std;

#define endl '\n'

// Quick power: the pow() function in C++ is unstable at times so it is better to write our own power function.
int quickpow(int a, int b) {
    int res = 1;
    while (b) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

bool is_power_of_2(int a){
    return ((a|(a-1)) == 2*a - 1);
}

// Here we create the generator matrix
vector<vector<int>> create_g_matrix (int r){
    int size = quickpow(2,r), tem;
    vector<vector<int>> G(size - r - 1, vector<int>(size - 1));
    int cnt = 0;
    for (int i = size - 1; i >= 1; i--){
        if (!is_power_of_2(i)){
            G[cnt][size - 1 - i] = 1;
            tem = i;
            for (int j = 0; j < r; j++){
                G[cnt][size - 1 - quickpow(2,j)] = (tem % 2);
                tem >>= 1;
            }
            cnt++;
        }
    }
    return G;
}

// Here we create the check matrix
vector<vector<int>> create_h_matrix (int r){
    int size = quickpow(2, r), tem;
    vector<vector<int>> H(r, vector<int>(size - 1));
    for (int i = size - 1; i >= 1; i--){
        tem = i;
        for (int j = 0; j < r; j++){
            H[r - 1 - j][size - 1 - i] = (tem % 2);
            tem >>= 1;
        }
    }
    return H;
}

// Calculating the tranpose of a matrix
vector<vector<int>> tranpose(vector<vector<int>> A, int r, int c){
    vector<vector<int>> ans(c, vector<int> (r));
    for (int i = 0; i < c; i++){
        for (int j = 0; j < r; j++){
            ans[i][j] = A[j][i];
        }
    }
    return ans;
}

// Dot multiplication
int dot_mul(vector<int> A, vector<int> B, int size){
    int ans = 0;
    for (int i = 0; i < size; i++){
        ans += A[i]*B[i];
    }
    return ans;
}

// Matrix multiplication
vector<vector<int>> mat_mul(vector<vector<int>> A1, int r1, int c1, vector<vector<int>> A2, int r2, int c2){
    vector<vector<int>> ans(r1, vector<int> (c2));
    vector<vector<int>> A2t(c2, vector<int> (r2));
    A2t = tranpose(A2, r2, c2);
    for (int i = 0; i < r1; i++){
        for (int j = 0; j < c2; j++){
            ans[i][j] = dot_mul(A1[i], A2t[j], c1) % 2;
        }
    }
    return ans;
}

// Check if a vector is zero
bool is_zero_vector(vector<vector<int>> A){
    for (auto X:A){
        for (auto x:X){
            if (x != 0) return false;
        }
    }
    return true;
}

// Print a matrix
void print_mat(vector<vector<int>> A, int r, int c){
    for (int i = 0; i < r; i++){
        for (int j = 0; j < c; j++){
            cout << A[i][j];
        }
        cout << endl;
    }
}

void sender(){
    cout << "Enter r: ";
    int r; cin >> r;
    int size = quickpow(2,r);
    cout << "Message length is " << size - r - 1 << ". Please enter the required message: ";
    string msg; cin >> msg;
    vector<vector<int>> MSG(1, vector<int> (size - r - 1));
    for (int i = 0; i < size - r - 1; i++){
        MSG[0][i] = msg[i] - '0';
    }
    cout << "The Hamming Code for your message is ";
    print_mat(mat_mul( MSG, 1, size - r - 1, create_g_matrix(r), size - r - 1, size - 1 )  , 1, size - 1);
}

void receiver(){
    cout << "Enter r: ";
    int r; cin >> r;
    int size = quickpow(2,r);
    cout << "Please enter the Hamming Code received: ";
    string msg; cin >> msg;
    vector<vector<int>> MSG(1, vector<int> (size - 1));
    for (int i = 0; i < size - 1; i++){
        MSG[0][i] = msg[i] - '0';
    }
    vector<vector<int>> A(r, vector<int>(1));
    A = mat_mul(create_h_matrix(r), r, size - 1, tranpose(MSG, 1, size - 1), size - 1, 1);
    if (is_zero_vector(A)){
        cout << "No error detected" << endl;
    } else {
        cout << "Error detected!!!" << endl;
        int faulty_bit = -1;
        for (int i = r - 1; i >= 0; i--){
            faulty_bit += A[i][0] * quickpow(2, r - 1 - i);
        }
        MSG[0][quickpow(2,r) - 2 - faulty_bit] ^= 1;
    }
    cout << "The correct Hamming Code is: ";
    print_mat(MSG, 1, size - 1);
    cout << "The original message is: ";
    for (int i = 0; i < size - 1; i++){
        if (!is_power_of_2(size - 1 - i)) cout << MSG[0][i];
    }
    cout << endl;
}

int main(){
    sender(); // comment out receiver() to play sender
    receiver(); // comment out sender() to play receiver
}
