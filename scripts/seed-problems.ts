import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('MONGODB_URI not set')

const { protocol } = new URL(MONGODB_URI)
if (protocol !== 'mongodb:' && protocol !== 'mongodb+srv:') throw new Error('Invalid MONGODB_URI protocol')

const ProblemSchema = new mongoose.Schema({
  slug: String, title: String, description: String,
  difficulty: String, tags: [String],
  examples: [{ input: String, output: String, explanation: String }],
  testCases: [{ input: String, expected: String }],
  constraints: [String],
  starterCode: {
    javascript: String, typescript: String,
    python: String, java: String, cpp: String, go: String,
  },
  isDaily: Boolean, dailyDate: String,
}, { timestamps: true })

const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema)

const problems = [
  {
    slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6',     expected: '[1,2]' },
      { input: '[3,3], 6',       expected: '[0,1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists'],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // your code here\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // your code here\n  return [];\n}`,
      python:     `def two_sum(nums: list[int], target: int) -> list[int]:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n        return new int[]{};\n    }\n}`,
      cpp:        `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // your code here\n    return {};\n}`,
      go:         `func twoSum(nums []int, target int) []int {\n    // your code here\n    return nil\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['Stack', 'String'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    testCases: [
      { input: '"()"',     expected: 'true'  },
      { input: '"()[]{}"', expected: 'true'  },
      { input: '"(]"',     expected: 'false' },
      { input: '"([)]"',   expected: 'false' },
      { input: '"{[]}"',   expected: 'true'  },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\' '],
    starterCode: {
      javascript: `function isValid(s) {\n  // your code here\n}`,
      typescript: `function isValid(s: string): boolean {\n  // your code here\n  return false;\n}`,
      python:     `def is_valid(s: str) -> bool:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public boolean isValid(String s) {\n        // your code here\n        return false;\n    }\n}`,
      cpp:        `#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    // your code here\n    return false;\n}`,
      go:         `func isValid(s string) bool {\n    // your code here\n    return false\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List', 'Recursion'],
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: '' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: '' },
      { input: 'head = []', output: '[]', explanation: '' },
    ],
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: '[1,2]',       expected: '[2,1]'       },
      { input: '[]',          expected: '[]'          },
    ],
    constraints: ['The number of nodes in the list is in the range [0, 5000]', '-5000 <= Node.val <= 5000'],
    starterCode: {
      javascript: `function reverseList(head) {\n  // your code here\n}`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {\n  // your code here\n  return null;\n}`,
      python:     `def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // your code here\n        return null;\n    }\n}`,
      cpp:        `ListNode* reverseList(ListNode* head) {\n    // your code here\n    return nullptr;\n}`,
      go:         `func reverseList(head *ListNode) *ListNode {\n    // your code here\n    return nil\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'best-time-to-buy-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['Array', 'Dynamic Programming'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6), profit = 5' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profit possible' },
    ],
    testCases: [
      { input: '[7,1,5,3,6,4]', expected: '5' },
      { input: '[7,6,4,3,1]',   expected: '0' },
      { input: '[1,2]',         expected: '1' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // your code here\n}`,
      typescript: `function maxProfit(prices: number[]): number {\n  // your code here\n  return 0;\n}`,
      python:     `def max_profit(prices: list[int]) -> int:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public int maxProfit(int[] prices) {\n        // your code here\n        return 0;\n    }\n}`,
      cpp:        `#include <vector>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // your code here\n    return 0;\n}`,
      go:         `func maxProfit(prices []int) int {\n    // your code here\n    return 0\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', tags: ['Dynamic Programming', 'Math'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: 'Two ways: 1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, or 2+1' },
    ],
    testCases: [
      { input: '2', expected: '2' },
      { input: '3', expected: '3' },
      { input: '5', expected: '8' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // your code here\n}`,
      typescript: `function climbStairs(n: number): number {\n  // your code here\n  return 0;\n}`,
      python:     `def climb_stairs(n: int) -> int:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public int climbStairs(int n) {\n        // your code here\n        return 0;\n    }\n}`,
      cpp:        `int climbStairs(int n) {\n    // your code here\n    return 0;\n}`,
      go:         `func climbStairs(n int) int {\n    // your code here\n    return 0\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'longest-substring-without-repeating', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Map', 'String'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3' },
    ],
    testCases: [
      { input: '"abcabcbb"', expected: '3' },
      { input: '"bbbbb"',    expected: '1' },
      { input: '"pwwkew"',   expected: '3' },
      { input: '""',         expected: '0' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // your code here\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // your code here\n  return 0;\n}`,
      python:     `def length_of_longest_substring(s: str) -> int:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // your code here\n        return 0;\n    }\n}`,
      cpp:        `#include <string>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // your code here\n    return 0;\n}`,
      go:         `func lengthOfLongestSubstring(s string) int {\n    // your code here\n    return 0\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'],
    description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap → merge to [1,6]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: '[1,4] and [4,5] are considered overlapping' },
    ],
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]',                expected: '[[1,5]]'                },
      { input: '[[1,4],[0,4]]',                expected: '[[0,4]]'                },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
    starterCode: {
      javascript: `function merge(intervals) {\n  // your code here\n}`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  // your code here\n  return [];\n}`,
      python:     `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // your code here\n        return new int[][]{};\n    }\n}`,
      cpp:        `#include <vector>\nusing namespace std;\n\nvector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // your code here\n    return {};\n}`,
      go:         `func merge(intervals [][]int) [][]int {\n    // your code here\n    return nil\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'word-search', title: 'Word Search', difficulty: 'Medium', tags: ['Backtracking', 'DFS', 'Matrix'],
    description: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: '' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true', explanation: '' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false', explanation: '' },
    ],
    testCases: [
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', expected: 'true'  },
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"',    expected: 'true'  },
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"',   expected: 'false' },
    ],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
    starterCode: {
      javascript: `function exist(board, word) {\n  // your code here\n}`,
      typescript: `function exist(board: string[][], word: string): boolean {\n  // your code here\n  return false;\n}`,
      python:     `def exist(board: list[list[str]], word: str) -> bool:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public boolean exist(char[][] board, String word) {\n        // your code here\n        return false;\n    }\n}`,
      cpp:        `#include <vector>\n#include <string>\nusing namespace std;\n\nbool exist(vector<vector<char>>& board, string word) {\n    // your code here\n    return false;\n}`,
      go:         `func exist(board [][]byte, word string) bool {\n    // your code here\n    return false\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Binary Search', 'Array', 'Divide and Conquer'],
    description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log(m+n)).',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged = [1,2,3], median = 2' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'merged = [1,2,3,4], median = (2+3)/2 = 2.5' },
    ],
    testCases: [
      { input: '[1,3], [2]',   expected: '2.00000' },
      { input: '[1,2], [3,4]', expected: '2.50000' },
      { input: '[0,0], [0,0]', expected: '0.00000' },
    ],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000'],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // your code here\n}`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // your code here\n  return 0;\n}`,
      python:     `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // your code here\n        return 0.0;\n    }\n}`,
      cpp:        `#include <vector>\nusing namespace std;\n\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // your code here\n    return 0.0;\n}`,
      go:         `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {\n    // your code here\n    return 0.0\n}`,
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '' },
    ],
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
      { input: '[4,2,0,3,2,5]',              expected: '9' },
      { input: '[1,0,1]',                    expected: '1' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: `function trap(height) {\n  // your code here\n}`,
      typescript: `function trap(height: number[]): number {\n  // your code here\n  return 0;\n}`,
      python:     `def trap(height: list[int]) -> int:\n    # your code here\n    pass`,
      java:       `class Solution {\n    public int trap(int[] height) {\n        // your code here\n        return 0;\n    }\n}`,
      cpp:        `#include <vector>\nusing namespace std;\n\nint trap(vector<int>& height) {\n    // your code here\n    return 0;\n}`,
      go:         `func trap(height []int) int {\n    // your code here\n    return 0\n}`,
    },
    isDaily: false, dailyDate: null,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')
  for (const p of problems) {
    await Problem.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, returnDocument: 'after' })
    console.log(`✓ ${p.title.replace(/[\r\n]/g, '')}`)
  }
  console.log(`\nSeeded ${problems.length} problems with 6 languages each.`)
  await mongoose.disconnect()
}

seed().catch((err) => { console.error(err); process.exit(1) })
