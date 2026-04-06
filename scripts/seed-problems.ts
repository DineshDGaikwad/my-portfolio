import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('MONGODB_URI not set')

const ProblemSchema = new mongoose.Schema({
  slug: String, title: String, description: String,
  difficulty: String, tags: [String],
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  starterCode: { javascript: String, python: String, java: String },
  isDaily: Boolean, dailyDate: String,
}, { timestamps: true })

const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema)

const problems = [
  {
    slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10^4', 'Only one valid answer exists'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // your code here\n}',
      python: 'def two_sum(nums: list[int], target: int) -> list[int]:\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['Stack', 'String'],
    description: 'Given a string `s` containing just `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      javascript: 'function isValid(s) {\n  // your code here\n}',
      python: 'def is_valid(s: str) -> bool:\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List', 'Recursion'],
    description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: '' },
    ],
    constraints: ['0 <= number of nodes <= 5000'],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // your code here\n}',
      python: 'def reverse_list(head):\n    pass',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'best-time-to-buy-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['Array', 'Dynamic Programming'],
    description: 'Given an array `prices`, return the maximum profit from buying and selling one stock. Return 0 if no profit is possible.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1, sell at 6' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profit possible' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: {
      javascript: 'function maxProfit(prices) {\n  // your code here\n}',
      python: 'def max_profit(prices: list[int]) -> int:\n    pass',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', tags: ['Dynamic Programming', 'Math'],
    description: 'You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: 'function climbStairs(n) {\n  // your code here\n}',
      python: 'def climb_stairs(n: int) -> int:\n    pass',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'longest-substring-without-repeating', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Map', 'String'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc"' },
      { input: 's = "pwwkew"', output: '3', explanation: '"wke"' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // your code here\n}',
      python: 'def length_of_longest_substring(s: str) -> int:\n    pass',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'],
    description: 'Given an array of `intervals`, merge all overlapping intervals and return the non-overlapping result.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap' },
    ],
    constraints: ['1 <= intervals.length <= 10^4'],
    starterCode: {
      javascript: 'function merge(intervals) {\n  // your code here\n}',
      python: 'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    pass',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'word-search', title: 'Word Search', difficulty: 'Medium', tags: ['Backtracking', 'DFS', 'Matrix'],
    description: 'Given an `m x n` grid and a string `word`, return true if the word exists in the grid using sequentially adjacent cells (horizontal/vertical). Each cell may not be reused.',
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: '' },
    ],
    constraints: ['1 <= m, n <= 6', '1 <= word.length <= 15'],
    starterCode: {
      javascript: 'function exist(board, word) {\n  // your code here\n}',
      python: 'def exist(board: list[list[str]], word: str) -> bool:\n    pass',
      java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Binary Search', 'Array', 'Divide and Conquer'],
    description: 'Given two sorted arrays `nums1` and `nums2`, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged = [1,2,3]' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: '(2+3)/2 = 2.5' },
    ],
    constraints: ['0 <= m, n <= 1000', '1 <= m + n <= 2000'],
    starterCode: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // your code here\n}',
      python: 'def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:\n    pass',
      java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
  {
    slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers', 'Stack'],
    description: 'Given `n` non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of water trapped' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '' },
    ],
    constraints: ['1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: 'function trap(height) {\n  // your code here\n}',
      python: 'def trap(height: list[int]) -> int:\n    pass',
      java: 'class Solution {\n    public int trap(int[] height) {\n        // your code here\n    }\n}',
    },
    isDaily: false, dailyDate: null,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')
  for (const p of problems) {
    await Problem.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true })
    console.log(`✓ ${p.title}`)
  }
  console.log(`\nSeeded ${problems.length} problems.`)
  await mongoose.disconnect()
}

seed().catch((err) => { console.error(err); process.exit(1) })
