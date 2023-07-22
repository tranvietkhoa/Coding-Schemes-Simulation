/**
 * This piece of code simulates the process of convolutional encoding and decoding.
 * 
 * Convolutional coding makes use of a shift register, which consists of fixed number of bits in a line.
 * Bits are shifted rightward and a new bit is added to the left after each iteration of operations.
 * Each operation produces a bit from addition of bits at some positions on the shift register (i.e. XOR of bits)
 * 
 * Parameters of a convolutional coding are k, n and L,
 * where k is the number of bits in the input stream,
 * n is the number of generated bits per input bit, which is also the number of operations per iteration of the shift register,
 * L is the length of the shift register.
 * 
 * By default, the shift register starts with all zero bits.
 * Next bit from the input stream is inserted to the left of the register.
 * n bits are generated and are added to the code.
 * The bits on the shift register shifts rightward.
 * Repeat until the input stream is empty.
 * The code therefore contains n * k bits.
 * 
 * Convolutional decoding involves, upon receiving a (possibly altered) code,
 * and given n, k, L, deduce the code that can be produced by an input stream 
 * and has the least number of different bits from the given code,
 * and thereby deduce the original input stream.
 * Convolutional decoding therefore may fail, depending on the number of errors and positions of errors.
 * 
 * More info on convolutional coding can be found at https://www.sciencedirect.com/science/article/abs/pii/B9780128154052000099
 * section 9.4.3
 * 
 * 
 * Since register is a series of bits, in this piece of code, we represent it by an integer (type int)
 * Each operation is characterised by the positions of bits on the register,
 * hence each operation is also represented by an integer (type int).
 * For example, on a shift register of length 3, addition of bits at positions 1 and 3 (from left to right)
 * can be represented by the bits 101, and hence by the number 5
 * Output at each iteration of the shift register is also represented by an integer.
 * For the code, since it is of length n * k, we represent it as an array of integers of length k.
 * 
 * Time complexity of encoding: O(n * k * L)
 * Time complexity of decoding: O(n * k * L * 2 ^ L)
 * Take note that as n, k and L grows larger, a different representation of states is needed (i.e. array of bits)
 * 
 * 
 * @author Nguyen Khoi Nguyen
 */


#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>

using namespace std;


/// Perform power operation a ^ b in O(log b) time
int quickPow(int a, int b) {
    int res = 1;
    while (b) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}


/// Perform dot multiplication of bits, returning 0 if result is divisible by 2, or 1 otherwise
bool bitDotMul(int a, int b, int size) {
    bool ans = 0;
    int andBitResult = a & b;
    for (int i = 0; i < size; i++) {
        ans ^= andBitResult & 1;
        andBitResult >>= 1;
    }
    return ans;
}


/**
 * Give the next output consisting of n bits on a shift register of length L,
 * given the current state of the shift register and the operations to be done on the bits.
 * Each operation is represented by an integer, where in binary representation,
 * 1 indicates that the corresponding bit on the shift register is used in the operation, and 0 indicates otherwise.
 * @param n the number of bits in the output
 * @param L the length of the shift register
 * @param adders the set of operations on the shift register
 * @param currState the current state of the shift register
 * @return the sequence of n output bits represented by an integer
 */
int nextOutput(int n, int L, vector<int> adders, int currState) {
    int result = 0;
    for (int aIndex = 0; aIndex < n; aIndex++) {
        result = (result << 1) + bitDotMul(adders[aIndex], currState, L);
    }
    return result;
}


/**
 * Given the input stream and the set of operations, and the relevant paramters, encode the input stream.
 * This is equivalent to calling nextOutput function and shifting the bits on the shift register k times.
 * @param k number of bits in input
 * @param n number of bits in output per iteration of the shift register
 * @param L length of shift register
 * @param adders operations to be done on the bits on the shift register
 * @param input the input
 * @return a sequence of outputs, each consisting of n bits
 */
vector<int> output(int k, int n, int L, vector<int> adders, int input) {
    vector<int> result(k);
    int currState = 0;
    for (int iIndex = 0; iIndex < k; iIndex++) {
        currState = (currState >> 1) + ((input & 1) << (L - 1));
        input >>= 1;
        result[iIndex] = nextOutput(n, L, adders, currState);
    }
    return result;
}


/**
 * This class stores information of the message and the corrected code sequence,
 * to be used as return type for convolutional decoding.
 */
class Pair {
    public:
        int message;
        vector<int> codeSequence;

        Pair(int message, vector<int> codeSequence) {
            this->message = message;
            this->codeSequence = codeSequence;
        }
};


/// Determine if the current state (omitting the leftmost bit) on the shift register is possible, 
/// given the number of shifts performed on the shift register.
bool isPossibleState(int state, int stepCount, int L) {
    const int numOfEndingZeros = L - 1 - stepCount;
    if (numOfEndingZeros <= 0) {
        return true;
    }

    for (int i = 0; i < numOfEndingZeros; i++) {
        if (state & 1) {
            return false;
        }
        state >>= 1;
    }
    return true;
}


/// Count the number of different bits in two sequences of bits of length n
int bitErrCount(int expected, int actual, int n) {
    int result = 0;
    int XORBitResult = expected ^ actual;
    bool err;
    for (int i = 0; i < n; i++) {
        result += XORBitResult & 1;
        XORBitResult >>= 1;
    }
    return result;
}


/**
 * Convolutional decoding, returning the corrected code and the (possibly wrong) original message.
 * Each operation is represented by an integer, where in binary representation,
 * 1 indicates that the corresponding bit on the shift register is used in the operation, and 0 indicates otherwise.
 * @param k number of bits in the original input
 * @param n number of output bits per input bit
 * @param L length of shift register
 * @param adders set of operations performed on the shift register bits
 * @param code the given (possibly altered)
 * @return the corrected code and the original message
 */
Pair decode(int k, int n, int L, vector<int> adders, vector<int> code) {
    const int nodeCount = quickPow(2, L - 1);
    vector<vector<int>> currCodes(nodeCount, vector<int>(k));
    vector<vector<int>> nextCodes(nodeCount, vector<int>(k));
    vector<int> currSequences(nodeCount);
    vector<int> nextSequences(nodeCount);
    vector<int> currErrCount(nodeCount);
    vector<int> nextErrCount(nodeCount, n * k);

    int bitZeroOutput;
    int bitOneOutput;
    int bitZeroNextIndex;
    int bitOneNextIndex;
    int bitZeroErrCount;
    int bitOneErrCount;
    int oneState;

    // calculate for every node
    for (int i = 0; i < k; i++) {
        for (int j = 0; j < nodeCount; j++) {
            if (isPossibleState(j, i, L)) {
                // if next bit is 0
                bitZeroOutput = nextOutput(n, L, adders, j);
                bitZeroNextIndex = j >> 1;
                bitZeroErrCount = bitErrCount(code[i], bitZeroOutput, n) + currErrCount[j];
                if (bitZeroErrCount < nextErrCount[bitZeroNextIndex]) {
                    nextCodes[bitZeroNextIndex] = currCodes[j];
                    nextCodes[bitZeroNextIndex][i] = bitZeroOutput;
                    nextSequences[bitZeroNextIndex] = currSequences[j];
                    nextErrCount[bitZeroNextIndex] = bitZeroErrCount;
                }

                // if next bit is 1
                oneState = j + (1 << (L - 1));
                bitOneOutput = nextOutput(n, L, adders, oneState);
                bitOneNextIndex = oneState >> 1;
                bitOneErrCount = bitErrCount(code[i], bitOneOutput, n) + currErrCount[j];
                if (bitOneErrCount < nextErrCount[bitOneNextIndex]) {
                    nextCodes[bitOneNextIndex] = currCodes[j];
                    nextCodes[bitOneNextIndex][i] = bitOneOutput;
                    nextSequences[bitOneNextIndex] = currSequences[j] + (1 << i);
                    nextErrCount[bitOneNextIndex] = bitOneErrCount;
                }
            }
        }

        currCodes = nextCodes;
        nextCodes = vector<vector<int>>(nodeCount, vector<int>(k));
        currSequences = nextSequences;
        nextSequences = vector<int>(nodeCount);
        currErrCount = nextErrCount;
        nextErrCount = vector<int>(nodeCount, n * k);
    }

    int indexBest = 0;
    for (int i = 1; i < nodeCount; i++) {
        if (currErrCount[i] < currErrCount[indexBest]) {
            indexBest = i;
        }
    }

    return Pair(currSequences[indexBest], currCodes[indexBest]);
}


/// Turn a number into binary, in the form of a string
string binaryString(int number, int n) {
    ostringstream ss;
    for (int j = 0; j < n; j++) {
        ss << (number & 1);
        number >>= 1;
    }
    string reversed = ss.str();
    reverse(reversed.begin(), reversed.end());
    return reversed;
}


/// Turn a string of binary into a number
int numberFromBinaryString(string str) {
    int result = 0;
    for (int i = 0; i < str.length(); i++) {
        result = (result << 1) + (str[i] - '0');
    }
    return result;
}


/// Print out a code
void printResult(vector<int> result, int k, int n) {
    for (int i = 0; i < k; i++) {
        cout << binaryString(result[i], n) << " ";
    }
    cout << endl;
}


/**
 * Get the next output based on input from user.
 * Sample inputs are found in the comments
 */
void getNextOutput() {
    int n; // 2
    cin >> n;

    int L; // 3
    cin >> L;

    vector<int> adders(n); // 111, 101
    string inputStr;
    for (int i = 0; i < n; i++) {
        cin >> inputStr;
        adders[i] = numberFromBinaryString(inputStr);
    }

    cin >> inputStr;
    int currState = numberFromBinaryString(inputStr);
    
    cout << binaryString(nextOutput(n, L, adders, currState), n);
}


/**
 * Test sending message, where the user inputs n, k, L,
 * set of operations and input.
 * Sample inputs are given, these match the inputs found in the paper from the link above.
 */
void sendMessage() {
    int k; // 6
    cout << "k: ";
    cin >> k;

    int n; // 2
    cout << "n: ";
    cin >> n;

    int L; // 3
    cout << "L: ";
    cin >> L;

    int input; // 001101
    string inputStr;
    cout << "Input (First on the right): ";
    cin >> inputStr;
    input = numberFromBinaryString(inputStr);

    vector<int> adders(n); // 111, 101
    for (int i = 0; i < n; i++) {
        cout << "Adder " << i << ": ";
        cin >> inputStr;
        adders[i] = numberFromBinaryString(inputStr);
    }

    vector<int> result = output(k, n, L, adders, input);
    cout << "Encoded message: ";
    printResult(result, k, n); // 11 10 00 01 01 11
}


void sendMessageNoExtra() {
    int k; // 6
    cin >> k;

    int n; // 2
    cin >> n;

    int L; // 3
    cin >> L;

    int input; // 001101
    string inputStr;
    cin >> inputStr;
    input = numberFromBinaryString(inputStr);

    vector<int> adders(n); // 111, 101
    for (int i = 0; i < n; i++) {
        cin >> inputStr;
        adders[i] = numberFromBinaryString(inputStr);
    }

    vector<int> result = output(k, n, L, adders, input);
    printResult(result, k, n); // 11 10 00 01 01 11
}


/**
 * Test receiving message, where the user inputs n, k, L,
 * set of operations and received code.
 * Sample inputs are given, these match the inputs found in the paper from the link above.
 */
void correctMessage() {
    int k; // 6
    cout << "k: ";
    cin >> k;

    int n; // 2
    cout << "n: ";
    cin >> n;

    int L; // 3
    cout << "L: ";
    cin >> L;

    string inputStr;
    vector<int> adders(n); // 111, 101
    for (int i = 0; i < n; i++) {
        cout << "Adder " << i << ": ";
        cin >> inputStr;
        adders[i] = numberFromBinaryString(inputStr);
    }

    cout << "Received code: "; // 11 10 01 01 11 11
    vector<int> code(k);
    for (int i = 0; i < k; i++) {
        cin >> inputStr;
        code[i] = numberFromBinaryString(inputStr);
    }

    Pair result = decode(k, n, L, adders, code);
    cout << "Corrected code: ";
    printResult(result.codeSequence, k, n); // 11 10 00 01 01 11
    cout << "Decoded message: " << binaryString(result.message, k); // 001101
}


void correctMessageNoExtra() {
    int k; // 6
    cin >> k;

    int n; // 2
    cin >> n;

    int L; // 3
    cin >> L;

    string inputStr;
    vector<int> adders(n); // 111, 101
    for (int i = 0; i < n; i++) {
        cin >> inputStr;
        adders[i] = numberFromBinaryString(inputStr);
    }

    // 11 10 01 01 11 11
    vector<int> code(k);
    for (int i = 0; i < k; i++) {
        cin >> inputStr;
        code[i] = numberFromBinaryString(inputStr);
    }

    Pair result = decode(k, n, L, adders, code);
    printResult(result.codeSequence, k, n); // 11 10 00 01 01 11
    cout << binaryString(result.message, k); // 001101
}


int main(int argc, char** argv) {
    // sendMessage();
    // correctMessage();
    string arg(argv[1]);
    if (arg == "sendmessage") {
        sendMessageNoExtra();
    } else if (arg == "correctmessage") {
        correctMessageNoExtra();
    } else if (arg == "nextoutput") {
        getNextOutput();
    }
}