 
const questionsData = {

  "arrays":[
    {
      title: `QUESTION:
    Given an array of integers nums and an integer target.
    Return the indices (0-indexed) of two elements in nums such that they add up to target.
    
    EXAMPLE:
    Input:
    nums = [1, 6, 2, 10, 3]
    target = 7
    
    Output:
    [0, 1]
    
    Explanation:
    nums[0] + nums[1] = 1 + 6 = 7`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Two nested loops are used to check every possible pair.
    
    Space Complexity: O(1)
    - No extra data structure is used.`,
    
      bruteForceCode: `class Solution {
    
        public int[] twoSum(int[] nums, int target) {
    
            int n = nums.length;
    
            for (int i = 0; i < n; i++) {
    
                for (int j = i + 1; j < n; j++) {
    
                    if (nums[i] + nums[j] == target) {
                        return new int[]{i, j};
                    }
                }
            }
    
            return new int[]{-1, -1};
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Each element is processed exactly once.
    
    Space Complexity: O(N)
    - HashMap may store up to N elements.`,
    
      optimalCode: `import java.util.*;
    
    class Solution {
    
        public int[] twoSum(int[] nums, int target) {
    
            HashMap<Integer, Integer> map = new HashMap<>();
    
            for (int i = 0; i < nums.length; i++) {
    
                int complement = target - nums[i];
    
                if (map.containsKey(complement)) {
                    return new int[]{map.get(complement), i};
                }
    
                map.put(nums[i], i);
            }
    
            return new int[]{-1, -1};
        }
    }`
    }, 
    {
      title: `QUESTION:
    Given an array nums consisting of only 0, 1, or 2. Sort the array in non-decreasing order.
    
    The sorting must be done in-place, without making a copy of the original array.
    
    EXAMPLE:
    Input: nums = [1, 0, 2, 1, 0]
    Output: [0, 0, 1, 1, 2]
    
    Explanation:
    The nums array in sorted order has 2 zeroes, 2 ones and 1 two.`,
    
      bruteForceComplexity: `Time Complexity: O(N log N)
    - Using built-in sorting algorithm.
    
    Space Complexity: O(1)
    - In-place sorting (depends on language implementation).`,
    
      bruteForceCode: `class Solution {
    
        public void sortColors(int[] nums) {
            Arrays.sort(nums);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Single pass with three pointers.
    
    Space Complexity: O(1)
    - Only uses constant extra space.`,
    
      optimalCode: `class Solution {
    
        public void sortColors(int[] nums) {
            int low = 0;
            int mid = 0;
            int high = nums.length - 1;
    
            while (mid <= high) {
                if (nums[mid] == 0) {
                    // Swap with low
                    int temp = nums[low];
                    nums[low] = nums[mid];
                    nums[mid] = temp;
                    low++;
                    mid++;
                } else if (nums[mid] == 1) {
                    mid++;
                } else {
                    // Swap with high
                    int temp = nums[high];
                    nums[high] = nums[mid];
                    nums[mid] = temp;
                    high--;
                }
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array nums of size n, return the majority element.
    The majority element is the element that appears more than n/2 times.
    You may assume that the majority element always exists in the array.
    
    EXAMPLE:
    Input: nums = [2, 2, 1, 1, 1, 2, 2]
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - For each element, count its occurrences.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int majorityElement(int[] nums) {
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int count = 0;
                for (int j = 0; j < n; j++) {
                    if (nums[i] == nums[j]) count++;
                }
                if (count > n / 2) return nums[i];
            }
            return -1;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Single pass using Boyer-Moore Voting Algorithm.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int majorityElement(int[] nums) {
            int count = 0;
            int candidate = 0;
            
            for (int num : nums) {
                if (count == 0) {
                    candidate = num;
                }
                count += (num == candidate) ? 1 : -1;
            }
            return candidate;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an integer array nums, find the subarray with the largest sum and return its sum.
    
    EXAMPLE:
    Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
    Output: 6
    Explanation: [4,-1,2,1] has the largest sum = 6.`,
    
      bruteForceComplexity: `Time Complexity: O(N³) or O(N²)
    - Check all possible subarrays.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maxSubArray(int[] nums) {
            int maxSum = Integer.MIN_VALUE;
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int sum = 0;
                for (int j = i; j < n; j++) {
                    sum += nums[j];
                    maxSum = Math.max(maxSum, sum);
                }
            }
            return maxSum;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Kadane's Algorithm - Single pass.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxSubArray(int[] nums) {
            int maxSum = nums[0];
            int currentSum = nums[0];
            
            for (int i = 1; i < nums.length; i++) {
                currentSum = Math.max(nums[i], currentSum + nums[i]);
                maxSum = Math.max(maxSum, currentSum);
            }
            return maxSum;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an integer array nums, find the subarray with the largest sum and return its sum.
    
    EXAMPLE:
    Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
    Output: 6
    Explanation: [4,-1,2,1] has the largest sum = 6.`,
    
      bruteForceComplexity: `Time Complexity: O(N³) or O(N²)
    - Check all possible subarrays.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maxSubArray(int[] nums) {
            int maxSum = Integer.MIN_VALUE;
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int sum = 0;
                for (int j = i; j < n; j++) {
                    sum += nums[j];
                    maxSum = Math.max(maxSum, sum);
                }
            }
            return maxSum;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Kadane's Algorithm - Single pass.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxSubArray(int[] nums) {
            int maxSum = nums[0];
            int currentSum = nums[0];
            
            for (int i = 1; i < nums.length; i++) {
                currentSum = Math.max(nums[i], currentSum + nums[i]);
                maxSum = Math.max(maxSum, currentSum);
            }
            return maxSum;
        }
    }`
    },

    {
      title: `QUESTION:
    You are given an array prices where prices[i] is the price of a given stock on the ith day.
    Find the maximum profit you can achieve. You may complete only one transaction.
    
    EXAMPLE:
    Input: prices = [7,1,5,3,6,4]
    Output: 5
    Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 5.`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Check all possible buy-sell pairs.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maxProfit(int[] prices) {
            int maxProfit = 0;
            int n = prices.length;
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
                }
            }
            return maxProfit;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Single pass keeping track of minimum price.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int[] prices) {
            int minPrice = Integer.MAX_VALUE;
            int maxProfit = 0;
            
            for (int price : prices) {
                if (price < minPrice) {
                    minPrice = price;
                } else {
                    maxProfit = Math.max(maxProfit, price - minPrice);
                }
            }
            return maxProfit;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array nums of even length consisting of equal number of positive and negative integers.
    Rearrange the array such that every positive integer is followed by a negative integer and vice versa.
    The relative order of positive and negative numbers should be maintained.
    
    EXAMPLE:
    Input: nums = [3,1,-2,-5,2,-4]
    Output: [3,-2,1,-5,2,-4]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    - Two passes to separate positives and negatives.
    
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int[] rearrangeArray(int[] nums) {
            List<Integer> pos = new ArrayList<>();
            List<Integer> neg = new ArrayList<>();
            
            for (int num : nums) {
                if (num > 0) pos.add(num);
                else neg.add(num);
            }
            
            int[] result = new int[nums.length];
            for (int i = 0; i < nums.length / 2; i++) {
                result[2 * i] = pos.get(i);
                result[2 * i + 1] = neg.get(i);
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Single pass using two pointers.
    
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int[] rearrangeArray(int[] nums) {
            int[] result = new int[nums.length];
            int posIndex = 0, negIndex = 1;
            
            for (int num : nums) {
                if (num > 0) {
                    result[posIndex] = num;
                    posIndex += 2;
                } else {
                    result[negIndex] = num;
                    negIndex += 2;
                }
            }
            return result;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array of integers nums, find the next permutation of nums.
    The replacement must be in place and use only constant extra memory.
    
    EXAMPLE:
    Input: nums = [1,2,3]
    Output: [1,3,2]`,
    
      bruteForceComplexity: `Time Complexity: O(N!)
    - Generate all permutations.
    
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Brute force not practical for large N`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Single pass from right.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public void nextPermutation(int[] nums) {
            int n = nums.length;
            int i = n - 2;
            
            while (i >= 0 && nums[i] >= nums[i + 1]) {
                i--;
            }
            
            if (i >= 0) {
                int j = n - 1;
                while (nums[j] <= nums[i]) {
                    j--;
                }
                swap(nums, i, j);
            }
            reverse(nums, i + 1, n - 1);
        }
        
        private void swap(int[] nums, int i, int j) {
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }
        
        private void reverse(int[] nums, int start, int end) {
            while (start < end) {
                swap(nums, start, end);
                start++;
                end--;
            }
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array nums of n integers, return all the leaders in the array.
    An element is a leader if it is greater than all the elements to its right.
    
    EXAMPLE:
    Input: nums = [10, 22, 12, 3, 0, 6]
    Output: [22, 12, 6]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - For each element check all elements to its right.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> findLeaders(int[] nums) {
            List<Integer> leaders = new ArrayList<>();
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                boolean isLeader = true;
                for (int j = i + 1; j < n; j++) {
                    if (nums[j] > nums[i]) {
                        isLeader = false;
                        break;
                    }
                }
                if (isLeader) leaders.add(nums[i]);
            }
            return leaders;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Single pass from right to left.
    
    Space Complexity: O(1) (excluding output list)`,
    
      optimalCode: `class Solution {
        public List<Integer> findLeaders(int[] nums) {
            List<Integer> leaders = new ArrayList<>();
            int n = nums.length;
            int maxRight = Integer.MIN_VALUE;
            
            for (int i = n - 1; i >= 0; i--) {
                if (nums[i] > maxRight) {
                    leaders.add(nums[i]);
                    maxRight = nums[i];
                }
            }
            Collections.reverse(leaders);
            return leaders;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.
    
    EXAMPLE:
    Input: nums = [100, 4, 200, 1, 3, 2]
    Output: 4
    Explanation: The longest consecutive sequence is [1, 2, 3, 4].`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - For each number check consecutive numbers.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int longestConsecutive(int[] nums) {
            int maxLen = 0;
            for (int num : nums) {
                int current = num;
                int len = 1;
                while (contains(nums, current + 1)) {
                    current++;
                    len++;
                }
                maxLen = Math.max(maxLen, len);
            }
            return maxLen;
        }
        private boolean contains(int[] nums, int target) {
            for (int num : nums) if (num == target) return true;
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - HashSet for O(1) lookups.
    
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int longestConsecutive(int[] nums) {
            Set<Integer> set = new HashSet<>();
            for (int num : nums) set.add(num);
            
            int maxLen = 0;
            for (int num : nums) {
                if (!set.contains(num - 1)) {
                    int current = num;
                    int len = 1;
                    while (set.contains(current + 1)) {
                        current++;
                        len++;
                    }
                    maxLen = Math.max(maxLen, len);
                }
            }
            return maxLen;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an m x n integer matrix, if an element is 0, set its entire row and column to 0's.
    Do it in-place.
    
    EXAMPLE:
    Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
    Output: [[1,0,1],[0,0,0],[1,0,1]]`,
    
      bruteForceComplexity: `Time Complexity: O(M*N*(M+N))
    - For each zero, mark row and column.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public void setZeroes(int[][] matrix) {
            int m = matrix.length;
            int n = matrix[0].length;
            
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (matrix[i][j] == 0) {
                        // Mark row and column (use a different value or extra space in real brute)
                        for (int k = 0; k < n; k++) if (matrix[i][k] != 0) matrix[i][k] = -999;
                        for (int k = 0; k < m; k++) if (matrix[k][j] != 0) matrix[k][j] = -999;
                    }
                }
            }
            
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (matrix[i][j] == -999) matrix[i][j] = 0;
                }
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M*N)
    - Single pass with constant space using first row and column as markers.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public void setZeroes(int[][] matrix) {
            int m = matrix.length;
            int n = matrix[0].length;
            boolean firstRow = false;
            boolean firstCol = false;
            
            for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;
            for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstCol = true;
            
            for (int i = 1; i < m; i++) {
                for (int j = 1; j < n; j++) {
                    if (matrix[i][j] == 0) {
                        matrix[i][0] = 0;
                        matrix[0][j] = 0;
                    }
                }
            }
            
            for (int i = 1; i < m; i++) {
                for (int j = 1; j < n; j++) {
                    if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                        matrix[i][j] = 0;
                    }
                }
            }
            
            if (firstRow) {
                for (int j = 0; j < n; j++) matrix[0][j] = 0;
            }
            if (firstCol) {
                for (int i = 0; i < m; i++) matrix[i][0] = 0;
            }
        }
    }`
    },

    {
      title: `QUESTION:
    Given an n x n 2D matrix, rotate it 90 degrees clockwise.
    Do it in-place.
    
    EXAMPLE:
    Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
    Output: [[7,4,1],[8,5,2],[9,6,3]]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Create new matrix and copy.
    
    Space Complexity: O(N²)`,
    
      bruteForceCode: `class Solution {
        public void rotate(int[][] matrix) {
            int n = matrix.length;
            int[][] temp = new int[n][n];
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    temp[j][n - 1 - i] = matrix[i][j];
                }
            }
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    matrix[i][j] = temp[i][j];
                }
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    - Transpose + Reverse each row.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public void rotate(int[][] matrix) {
            int n = matrix.length;
            
            // Transpose
            for (int i = 0; i < n; i++) {
                for (int j = i; j < n; j++) {
                    int temp = matrix[i][j];
                    matrix[i][j] = matrix[j][i];
                    matrix[j][i] = temp;
                }
            }
            
            // Reverse each row
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n/2; j++) {
                    int temp = matrix[i][j];
                    matrix[i][j] = matrix[i][n-1-j];
                    matrix[i][n-1-j] = temp;
                }
            }
        }
    }`
    },

    {
      title: `QUESTION:
    Given an m x n matrix, return all elements of the matrix in spiral order.
    
    EXAMPLE:
    Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
    Output: [1,2,3,6,9,8,7,4,5]`,
    
      bruteForceComplexity: `Time Complexity: O(M*N)
    - Simulation with direction changes.
    
    Space Complexity: O(1) (excluding output list)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> spiralOrder(int[][] matrix) {
            List<Integer> result = new ArrayList<>();
            if (matrix.length == 0) return result;
            
            int top = 0, bottom = matrix.length - 1;
            int left = 0, right = matrix[0].length - 1;
            
            while (top <= bottom && left <= right) {
                // Traverse Right
                for (int i = left; i <= right; i++) {
                    result.add(matrix[top][i]);
                }
                top++;
                
                // Traverse Down
                for (int i = top; i <= bottom; i++) {
                    result.add(matrix[i][right]);
                }
                right--;
                
                if (top <= bottom) {
                    // Traverse Left
                    for (int i = right; i >= left; i--) {
                        result.add(matrix[bottom][i]);
                    }
                    bottom--;
                }
                
                if (left <= right) {
                    // Traverse Up
                    for (int i = bottom; i >= top; i--) {
                        result.add(matrix[i][left]);
                    }
                    left++;
                }
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M*N)
    - Same as above (optimal simulation).
    
    Space Complexity: O(1) (excluding output)`,
    
      optimalCode: `class Solution {
        public List<Integer> spiralOrder(int[][] matrix) {
            List<Integer> result = new ArrayList<>();
            if (matrix.length == 0) return result;
            
            int top = 0, bottom = matrix.length - 1;
            int left = 0, right = matrix[0].length - 1;
            
            while (top <= bottom && left <= right) {
                for (int i = left; i <= right; i++) result.add(matrix[top][i]);
                top++;
                
                for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
                right--;
                
                if (top <= bottom) {
                    for (int i = right; i >= left; i--) result.add(matrix[bottom][i]);
                    bottom--;
                }
                
                if (left <= right) {
                    for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
                    left++;
                }
            }
            return result;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.
    
    EXAMPLE:
    Input: nums = [1,2,3], k = 3
    Output: 2
    Explanation: Subarrays [3] and [1,2] have sum = 3.`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Check sum of every possible subarray.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int subarraySum(int[] nums, int k) {
            int count = 0;
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int sum = 0;
                for (int j = i; j < n; j++) {
                    sum += nums[j];
                    if (sum == k) count++;
                }
            }
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Prefix sum + HashMap.
    
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int subarraySum(int[] nums, int k) {
            Map<Integer, Integer> prefixSum = new HashMap<>();
            prefixSum.put(0, 1);
            int sum = 0;
            int count = 0;
            
            for (int num : nums) {
                sum += num;
                if (prefixSum.containsKey(sum - k)) {
                    count += prefixSum.get(sum - k);
                }
                prefixSum.put(sum, prefixSum.getOrDefault(sum, 0) + 1);
            }
            return count;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an integer numRows, return the first numRows of Pascal's triangle.
    In Pascal's triangle, each number is the sum of the two numbers directly above it.
    
    EXAMPLE:
    Input: numRows = 5
    Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Build row by row.
    
    Space Complexity: O(N²)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> generate(int numRows) {
            List<List<Integer>> triangle = new ArrayList<>();
            for (int i = 0; i < numRows; i++) {
                List<Integer> row = new ArrayList<>();
                for (int j = 0; j <= i; j++) {
                    if (j == 0 || j == i) row.add(1);
                    else row.add(triangle.get(i-1).get(j-1) + triangle.get(i-1).get(j));
                }
                triangle.add(row);
            }
            return triangle;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    - Same as above (optimal).
    
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> generate(int numRows) {
            List<List<Integer>> triangle = new ArrayList<>();
            for (int i = 0; i < numRows; i++) {
                List<Integer> row = new ArrayList<>();
                for (int j = 0; j <= i; j++) {
                    if (j == 0 || j == i) row.add(1);
                    else row.add(triangle.get(i-1).get(j-1) + triangle.get(i-1).get(j));
                }
                triangle.add(row);
            }
            return triangle;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an integer array of size n, find all elements that appear more than ⌊n/3⌋ times.
    
    EXAMPLE:
    Input: nums = [3,2,3]
    Output: [3]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Count frequency of each element.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> majorityElement(int[] nums) {
            List<Integer> result = new ArrayList<>();
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int count = 0;
                for (int j = 0; j < n; j++) {
                    if (nums[i] == nums[j]) count++;
                }
                if (count > n / 3 && !result.contains(nums[i])) {
                    result.add(nums[i]);
                }
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Boyer-Moore Voting Algorithm (extended).
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public List<Integer> majorityElement(int[] nums) {
            List<Integer> result = new ArrayList<>();
            int candidate1 = 0, candidate2 = 0;
            int count1 = 0, count2 = 0;
            
            for (int num : nums) {
                if (num == candidate1) count1++;
                else if (num == candidate2) count2++;
                else if (count1 == 0) {
                    candidate1 = num;
                    count1 = 1;
                } else if (count2 == 0) {
                    candidate2 = num;
                    count2 = 1;
                } else {
                    count1--;
                    count2--;
                }
            }
            
            count1 = 0; count2 = 0;
            for (int num : nums) {
                if (num == candidate1) count1++;
                if (num == candidate2) count2++;
            }
            
            if (count1 > nums.length / 3) result.add(candidate1);
            if (count2 > nums.length / 3 && candidate1 != candidate2) result.add(candidate2);
            
            return result;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0.
    Return the answer in any order.
    
    EXAMPLE:
    Input: nums = [-1,0,1,2,-1,-4]
    Output: [[-1,-1,2],[-1,0,1]]`,
    
      bruteForceComplexity: `Time Complexity: O(N³)
    - Three nested loops.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> threeSum(int[] nums) {
            List<List<Integer>> result = new ArrayList<>();
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    for (int k = j + 1; k < n; k++) {
                        if (nums[i] + nums[j] + nums[k] == 0) {
                            List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
                            triplet.sort(null);
                            if (!result.contains(triplet)) result.add(triplet);
                        }
                    }
                }
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    - Sort + Two Pointers.
    
    Space Complexity: O(1) (excluding output)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> threeSum(int[] nums) {
            List<List<Integer>> result = new ArrayList<>();
            Arrays.sort(nums);
            int n = nums.length;
            
            for (int i = 0; i < n - 2; i++) {
                if (i > 0 && nums[i] == nums[i - 1]) continue;
                
                int left = i + 1, right = n - 1;
                while (left < right) {
                    int sum = nums[i] + nums[left] + nums[right];
                    if (sum == 0) {
                        result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                        left++;
                        right--;
                        while (left < right && nums[left] == nums[left - 1]) left++;
                        while (left < right && nums[right] == nums[right + 1]) right--;
                    } else if (sum < 0) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
            return result;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array nums of n integers, return an array of all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a != b != c != d and nums[a] + nums[b] + nums[c] + nums[d] == target.
    
    EXAMPLE:
    Input: nums = [1,0,-1,0,-2,2], target = 0
    Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]`,
    
      bruteForceComplexity: `Time Complexity: O(N⁴)
    - Four nested loops.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Not recommended due to high time complexity`,
    
      optimalComplexity: `Time Complexity: O(N³)
    - Sort + Two Pointers after fixing two elements.
    
    Space Complexity: O(1) (excluding output)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> fourSum(int[] nums, int target) {
            List<List<Integer>> result = new ArrayList<>();
            Arrays.sort(nums);
            int n = nums.length;
            
            for (int i = 0; i < n - 3; i++) {
                if (i > 0 && nums[i] == nums[i - 1]) continue;
                
                for (int j = i + 1; j < n - 2; j++) {
                    if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                    
                    int left = j + 1, right = n - 1;
                    while (left < right) {
                        long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];
                        if (sum == target) {
                            result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                            left++;
                            right--;
                            while (left < right && nums[left] == nums[left - 1]) left++;
                            while (left < right && nums[right] == nums[right + 1]) right--;
                        } else if (sum < target) {
                            left++;
                        } else {
                            right--;
                        }
                    }
                }
            }
            return result;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of integers, find the length of the largest subarray with sum equal to 0.
    
    EXAMPLE:
    Input: nums = [15, -2, 2, -8, 1, 7, 10, 23]
    Output: 5
    Explanation: The longest subarray with sum 0 is [-2, 2, -8, 1, 7].`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Check sum of every possible subarray.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maxLen(int[] nums) {
            int maxLength = 0;
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int sum = 0;
                for (int j = i; j < n; j++) {
                    sum += nums[j];
                    if (sum == 0) {
                        maxLength = Math.max(maxLength, j - i + 1);
                    }
                }
            }
            return maxLength;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Prefix sum + HashMap.
    
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maxLen(int[] nums) {
            Map<Integer, Integer> prefixSum = new HashMap<>();
            prefixSum.put(0, -1);
            int sum = 0;
            int maxLength = 0;
            
            for (int i = 0; i < nums.length; i++) {
                sum += nums[i];
                if (prefixSum.containsKey(sum)) {
                    maxLength = Math.max(maxLength, i - prefixSum.get(sum));
                } else {
                    prefixSum.put(sum, i);
                }
            }
            return maxLength;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of integers nums and an integer k, return the total number of subarrays whose XOR of all elements equals to k.
    
    EXAMPLE:
    Input: nums = [4, 2, 2, 6, 4], k = 6
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Check XOR of every possible subarray.
    
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int subarrayXor(int[] nums, int k) {
            int count = 0;
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int xor = 0;
                for (int j = i; j < n; j++) {
                    xor ^= nums[j];
                    if (xor == k) count++;
                }
            }
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    - Prefix XOR + HashMap.
    
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int subarrayXor(int[] nums, int k) {
            Map<Integer, Integer> prefixXor = new HashMap<>();
            prefixXor.put(0, 1);
            int xor = 0;
            int count = 0;
            
            for (int num : nums) {
                xor ^= num;
                if (prefixXor.containsKey(xor ^ k)) {
                    count += prefixXor.get(xor ^ k);
                }
                prefixXor.put(xor, prefixXor.getOrDefault(xor, 0) + 1);
            }
            return count;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.
    
    EXAMPLE:
    Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
    Output: [[1,6],[8,10],[15,18]]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Check every pair for overlap.
    
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Brute force is inefficient, better to sort first`,
    
      optimalComplexity: `Time Complexity: O(N log N)
    - Sorting + Single pass.
    
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int[][] merge(int[][] intervals) {
            if (intervals.length <= 1) return intervals;
            
            Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
            List<int[]> result = new ArrayList<>();
            int[] current = intervals[0];
            result.add(current);
            
            for (int[] interval : intervals) {
                if (interval[0] <= current[1]) {
                    current[1] = Math.max(current[1], interval[1]);
                } else {
                    current = interval;
                    result.add(current);
                }
            }
            return result.toArray(new int[result.size()][]);
        }
    }`
    },


    {
      title: `QUESTION:
    Given two sorted arrays arr1 and arr2 of size m and n respectively. Merge them in sorted order without using any extra space. Modify arr1 and arr2 so that arr1 contains the first m elements and arr2 contains the remaining elements.
    
    EXAMPLE:
    Input: arr1 = [1, 3, 5, 7], arr2 = [0, 2, 6, 8, 9]
    Output: arr1 = [0, 1, 2, 3, 5], arr2 = [6, 7, 8, 9]`,
    
      bruteForceComplexity: `Time Complexity: O((M+N) log(M+N))
    - Merge and sort.
    
    Space Complexity: O(M+N)`,
    
      bruteForceCode: `// Not allowed as per "without extra space"`,
    
      optimalComplexity: `Time Complexity: O(M + N)
    - Gap method (Shell sort inspired) or Two Pointers from end.
    
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public void merge(long arr1[], long arr2[], int n, int m) {
            int i = n - 1;
            int j = 0;
            
            while (i >= 0 && j < m) {
                if (arr1[i] > arr2[j]) {
                    long temp = arr1[i];
                    arr1[i] = arr2[j];
                    arr2[j] = temp;
                    i--;
                    j++;
                } else {
                    break;
                }
            }
            
            Arrays.sort(arr1);
            Arrays.sort(arr2);
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array of size n containing numbers from 1 to n with one number repeating and one number missing. Find the repeating and missing number.
    
    EXAMPLE:
    Input: arr = [4, 3, 6, 2, 1, 1]
    Output: Repeating = 1, Missing = 5`,
      
      bruteForceComplexity: `Time Complexity: O(N²) or O(N log N)
    - Use nested loops or sorting.
    Space Complexity: O(1) or O(N)`,
    
      bruteForceCode: `class Solution {
        public int[] findRepeatingMissing(int[] arr) {
            int n = arr.length;
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (arr[i] == arr[j]) {
                        // find missing
                        boolean[] visited = new boolean[n+1];
                        for (int num : arr) visited[num] = true;
                        for (int k = 1; k <= n; k++) {
                            if (!visited[k]) return new int[]{arr[i], k};
                        }
                    }
                }
            }
            return new int[]{-1, -1};
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) (using math) or O(N) (using HashMap)`,
    
      optimalCode: `class Solution {
        public int[] findRepeatingMissing(int[] arr) {
            long n = arr.length;
            long sum = 0, sumSq = 0;
            
            for (int num : arr) {
                sum += num;
                sumSq += (long) num * num;
            }
            
            long sumN = n * (n + 1) / 2;
            long sumSqN = n * (n + 1) * (2 * n + 1) / 6;
            
            long diff1 = sum - sumN;        // repeating - missing
            long diff2 = sumSq - sumSqN;    // repeating² - missing²
            
            long repeating = (diff2 / diff1 + diff1) / 2;
            long missing = repeating - diff1;
            
            return new int[]{(int)repeating, (int)missing};
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of integers nums, return the number of reverse pairs. A reverse pair is a pair (i, j) where 0 <= i < j < n and nums[i] > 2 * nums[j].
    
    EXAMPLE:
    Input: nums = [1, 3, 2, 3, 1]
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int reversePairs(int[] nums) {
            int count = 0;
            for (int i = 0; i < nums.length; i++) {
                for (int j = i + 1; j < nums.length; j++) {
                    if (nums[i] > 2L * nums[j]) count++;
                }
            }
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int reversePairs(int[] nums) {
            return mergeSort(nums, 0, nums.length - 1);
        }
        
        private int mergeSort(int[] arr, int left, int right) {
            if (left >= right) return 0;
            int mid = left + (right - left) / 2;
            int inv = mergeSort(arr, left, mid) + mergeSort(arr, mid + 1, right);
            inv += merge(arr, left, mid, right);
            return inv;
        }
        
        private int merge(int[] arr, int left, int mid, int right) {
            int[] temp = new int[right - left + 1];
            int i = left, j = mid + 1, k = 0;
            int inv = 0;
            
            // Count reverse pairs
            int p = left;
            for (int q = mid + 1; q <= right; q++) {
                while (p <= mid && arr[p] <= 2L * arr[q]) p++;
                inv += (mid - p + 1);
            }
            
            // Standard merge
            i = left; j = mid + 1;
            while (i <= mid && j <= right) {
                if (arr[i] <= arr[j]) {
                    temp[k++] = arr[i++];
                } else {
                    temp[k++] = arr[j++];
                }
            }
            while (i <= mid) temp[k++] = arr[i++];
            while (j <= right) temp[k++] = arr[j++];
            
            System.arraycopy(temp, 0, arr, left, temp.length);
            return inv;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.
    
    EXAMPLE:
    Input: nums = [2, 3, -2, 4]
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maxProduct(int[] nums) {
            int max = Integer.MIN_VALUE;
            for (int i = 0; i < nums.length; i++) {
                int prod = 1;
                for (int j = i; j < nums.length; j++) {
                    prod *= nums[j];
                    max = Math.max(max, prod);
                }
            }
            return max;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxProduct(int[] nums) {
            int maxProd = nums[0];
            int minProd = nums[0];
            int result = nums[0];
            
            for (int i = 1; i < nums.length; i++) {
                if (nums[i] < 0) {
                    int temp = maxProd;
                    maxProd = minProd;
                    minProd = temp;
                }
                
                maxProd = Math.max(nums[i], maxProd * nums[i]);
                minProd = Math.min(nums[i], minProd * nums[i]);
                
                result = Math.max(result, maxProd);
            }
            return result;
        }
    }`
    }
    ],

  "binary-search":[
    {
      title: `QUESTION:
    Given a non-negative integer x, return the square root of x rounded down to the nearest integer.
    
    EXAMPLE:
    Input: x = 8
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int mySqrt(int x) {
            if (x == 0) return 0;
            for (long i = 1; i <= x; i++) {
                if (i * i > x) return (int)(i - 1);
            }
            return (int)x;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int mySqrt(int x) {
            if (x == 0 || x == 1) return x;
            long low = 1, high = x;
            while (low <= high) {
                long mid = low + (high - low) / 2;
                if (mid * mid == x) return (int)mid;
                else if (mid * mid < x) low = mid + 1;
                else high = mid - 1;
            }
            return (int)high;
        }
    }`
    },


    {
      title: `QUESTION:
    Find the Nth root of a given number M (integer part).
    
    EXAMPLE:
    Input: N = 3, M = 27
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(M)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int NthRoot(int N, int M) {
            for (int i = 1; i <= M; i++) {
                if (Math.pow(i, N) == M) return i;
                if (Math.pow(i, N) > M) return i - 1;
            }
            return -1;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log M * log N)  // with pow function
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int NthRoot(int N, int M) {
            int low = 1, high = M;
            while (low <= high) {
                int mid = low + (high - low) / 2;
                long val = (long) Math.pow(mid, N);
                if (val == M) return mid;
                else if (val < M) low = mid + 1;
                else high = mid - 1;
            }
            return high;
        }
    }`
    },


    {
      title: `QUESTION:
    Koko loves to eat bananas. There are n piles of bananas, where the ith pile has piles[i] bananas. Koko can decide her eating speed of k bananas per hour. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour. Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return in h hours. Return the minimum integer k such that she can eat all the bananas within h hours.
    
    EXAMPLE:
    Input: piles = [3,6,7,11], h = 8
    Output: 4
    
    Explanation: 
    - With speed 4: 
      - Pile 3: 1 hour
      - Pile 6: 2 hours
      - Pile 7: 2 hours
      - Pile 11: 3 hours
    Total = 8 hours`,
    
      bruteForceComplexity: `Time Complexity: O(max(piles) * N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int minEatingSpeed(int[] piles, int h) {
            int maxPile = 0;
            for (int p : piles) {
                maxPile = Math.max(maxPile, p);
            }
            
            for (int k = 1; k <= maxPile; k++) {
                if (canEatAll(piles, k, h)) {
                    return k;
                }
            }
            return -1;
        }
        
        private boolean canEatAll(int[] piles, int speed, int h) {
            long hours = 0;
            for (int p : piles) {
                hours += (p + speed - 1) / speed;  // ceil(p / speed)
            }
            return hours <= h;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log MaxPile)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int minEatingSpeed(int[] piles, int h) {
            int low = 1;
            int high = 0;
            for (int p : piles) {
                high = Math.max(high, p);
            }
            
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (canEatAll(piles, mid, h)) {
                    high = mid;        // try smaller speed
                } else {
                    low = mid + 1;     // need bigger speed
                }
            }
            return low;
        }
        
        private boolean canEatAll(int[] piles, int speed, int h) {
            long hours = 0;
            for (int p : piles) {
                hours += (p + speed - 1) / speed;
                if (hours > h) return false;  // early exit
            }
            return hours <= h;
        }
    }`
    },


    {
      title: `QUESTION:
    You are given an integer array bloomDay, an integer m and an integer k. You want to make m bouquets. To make a bouquet, you need to use k adjacent flowers from the garden. The garden consists of n flowers, the ith flower will bloom in the bloomDay[i] and then can be used in exactly one bouquet. Return the minimum number of days you need to wait to be able to make m bouquets from the garden. If it is impossible, return -1.
    
    EXAMPLE:
    Input: bloomDay = [1,10,3,10,2], m = 3, k = 1
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N * MaxDay)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int minDays(int[] bloomDay, int m, int k) {
            if ((long)m * k > bloomDay.length) return -1;
            int maxDay = 0;
            for (int day : bloomDay) maxDay = Math.max(maxDay, day);
            
            for (int d = 1; d <= maxDay; d++) {
                if (canMake(bloomDay, d, m, k)) return d;
            }
            return -1;
        }
        
        private boolean canMake(int[] bloomDay, int day, int m, int k) {
            int bouquets = 0, flowers = 0;
            for (int bloom : bloomDay) {
                if (bloom <= day) {
                    flowers++;
                    if (flowers == k) {
                        bouquets++;
                        flowers = 0;
                    }
                } else {
                    flowers = 0;
                }
            }
            return bouquets >= m;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log MaxDay)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int minDays(int[] bloomDay, int m, int k) {
            if ((long)m * k > bloomDay.length) return -1;
            
            int low = 1, high = 0;
            for (int day : bloomDay) high = Math.max(high, day);
            
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (canMake(bloomDay, mid, m, k)) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
            return canMake(bloomDay, low, m, k) ? low : -1;
        }
        
        private boolean canMake(int[] bloomDay, int day, int m, int k) {
            int bouquets = 0, flowers = 0;
            for (int bloom : bloomDay) {
                if (bloom <= day) {
                    flowers++;
                    if (flowers == k) {
                        bouquets++;
                        flowers = 0;
                    }
                } else {
                    flowers = 0;
                }
            }
            return bouquets >= m;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an array of integers nums and a positive integer threshold, return the smallest positive integer divisor such that the sum of nums[i] divided by the divisor (using ceiling division) is less than or equal to threshold.
    
    EXAMPLE:
    Input: nums = [1,2,5,9], threshold = 6
    Output: 5`,
    
      bruteForceComplexity: `Time Complexity: O(N * MaxNum)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int smallestDivisor(int[] nums, int threshold) {
            int maxNum = 0;
            for (int num : nums) maxNum = Math.max(maxNum, num);
            
            for (int d = 1; d <= maxNum; d++) {
                if (sumDivision(nums, d) <= threshold) return d;
            }
            return -1;
        }
        
        private int sumDivision(int[] nums, int d) {
            int sum = 0;
            for (int num : nums) {
                sum += (num + d - 1) / d;
            }
            return sum;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log MaxNum)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int smallestDivisor(int[] nums, int threshold) {
            int low = 1, high = 0;
            for (int num : nums) high = Math.max(high, num);
            
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (sumDivision(nums, mid) <= threshold) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
            return low;
        }
        
        private int sumDivision(int[] nums, int d) {
            int sum = 0;
            for (int num : nums) {
                sum += (num + d - 1) / d;
            }
            return sum;
        }
    }`
    },


    {
      title: `QUESTION:
    A conveyor belt has a number of packages with given weights. Find the least weight capacity of the ship that will result in all the packages being shipped within D days.
    
    EXAMPLE:
    Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5
    Output: 15`,
    
      bruteForceComplexity: `Time Complexity: O(N * TotalSum)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Similar brute force as above, loop from maxWeight to totalSum`,
    
      optimalComplexity: `Time Complexity: O(N log Sum)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int shipWithinDays(int[] weights, int days) {
            int low = 0, high = 0;
            for (int w : weights) {
                low = Math.max(low, w);
                high += w;
            }
            
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (canShip(weights, mid, days)) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
            return low;
        }
        
        private boolean canShip(int[] weights, int cap, int days) {
            int requiredDays = 1, current = 0;
            for (int w : weights) {
                if (current + w > cap) {
                    requiredDays++;
                    current = 0;
                }
                current += w;
            }
            return requiredDays <= days;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array arr of positive integers sorted in strictly increasing order, and an integer k. Find the kth positive integer that is missing from this array.
    
    EXAMPLE:
    Input: arr = [2,3,4,7,11], k = 5
    Output: 9`,
    
      bruteForceComplexity: `Time Complexity: O(N + k)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int findKthPositive(int[] arr, int k) {
            int i = 0;
            for (int num = 1; ; num++) {
                if (i < arr.length && arr[i] == num) {
                    i++;
                } else {
                    k--;
                    if (k == 0) return num;
                }
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int findKthPositive(int[] arr, int k) {
            int low = 0, high = arr.length - 1;
            while (low <= high) {
                int mid = low + (high - low) / 2;
                if (arr[mid] - mid - 1 < k) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return low + k;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of stall positions and k cows, assign cows to stalls such that the minimum distance between any two cows is maximized. Return that maximum possible minimum distance.
    
    EXAMPLE:
    Input: stalls = [1,2,4,8,9], k = 3
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N² log MaxDist) or worse
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Linear search on possible distances with feasibility check`,
    
      optimalComplexity: `Time Complexity: O(N log MaxDist)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int aggressiveCows(int[] stalls, int k) {
            Arrays.sort(stalls);
            int low = 1, high = stalls[stalls.length - 1] - stalls[0];
            
            while (low <= high) {
                int mid = low + (high - low) / 2;
                if (canPlace(stalls, k, mid)) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return high;
        }
        
        private boolean canPlace(int[] stalls, int k, int dist) {
            int cows = 1, last = stalls[0];
            for (int i = 1; i < stalls.length; i++) {
                if (stalls[i] - last >= dist) {
                    cows++;
                    last = stalls[i];
                    if (cows >= k) return true;
                }
            }
            return false;
        }
    }`
    },



    {
      title: `QUESTION:
    Given an array of integers arr[] where each element represents the number of pages in a book, and an integer m representing the number of students. Allocate all the books to the m students such that each student gets at least one book, and the allocation is done in contiguous order. Minimize the maximum number of pages assigned to any student.
    
    EXAMPLE:
    Input: arr = [10, 20, 30, 40], m = 2
    Output: 60
    
    Explanation: 
    - Student 1 gets books with pages [10, 20] → 30 pages
    - Student 2 gets books with pages [30, 40] → 70 pages
    But optimal allocation is:
    - Student 1: [10,20,30] = 60 pages
    - Student 2: [40] = 40 pages
    Maximum load = 60`,
    
      bruteForceComplexity: `Time Complexity: O(N * Sum)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int bookAllocation(int[] arr, int m) {
            int n = arr.length;
            int totalSum = 0;
            int maxPages = 0;
            for (int pages : arr) {
                totalSum += pages;
                maxPages = Math.max(maxPages, pages);
            }
            
            for (int maxLoad = maxPages; maxLoad <= totalSum; maxLoad++) {
                if (isPossible(arr, m, maxLoad)) {
                    return maxLoad;
                }
            }
            return -1;
        }
        
        private boolean isPossible(int[] arr, int m, int maxLoad) {
            int students = 1, sum = 0;
            for (int pages : arr) {
                if (sum + pages > maxLoad) {
                    students++;
                    sum = pages;
                    if (students > m) return false;
                } else {
                    sum += pages;
                }
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log Sum)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int bookAllocation(int[] arr, int m) {
            int low = 0, high = 0;
            for (int num : arr) {
                low = Math.max(low, num);
                high += num;
            }
           
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (isPossible(arr, m, mid)) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
            return low;
        }
       
        private boolean isPossible(int[] arr, int m, int maxPages) {
            int students = 1, sum = 0;
            for (int pages : arr) {
                if (sum + pages > maxPages) {
                    students++;
                    sum = pages;
                    if (students > m) return false;
                } else {
                    sum += pages;
                }
            }
            return true;
        }
    }`
    },


    {
      title: `QUESTION:
    Place k new gas stations to minimize the maximum distance between stations.
    
    EXAMPLE:
    Input: stations = [1,2,3,4,5,6,7,8,9,10], k = 9
    Output: 0.5`,
    
      optimalComplexity: `Time Complexity: O(N log N) with binary search on double
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public double minmaxGasDist(int[] stations, int k) {
            double low = 0, high = 0;
            for (int i = 1; i < stations.length; i++) {
                high = Math.max(high, stations[i] - stations[i-1]);           // highest gap btwn stations 
            }
            
            while (high - low > 1e-6) {
                double mid = low + (high - low) / 2;
                if (possible(stations, k, mid)) {
                    high = mid;
                } else {
                    low = mid;
                }
            }
            return high;
        }
        
        private boolean possible(int[] stations, int k, double dist) {
            int count = 0;
            for (int i = 1; i < stations.length; i++) {
                count += Math.ceil((stations[i] - stations[i-1]) / dist) - 1;
            }
            return count <= k;
        }
    }`
    },


{
  title: `QUESTION:
Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

EXAMPLE:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0`,

  bruteForceComplexity: `Time Complexity: O(m + n)
Space Complexity: O(m + n)`,

  bruteForceCode: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {

        int m = nums1.length;              // size of first array
        int n = nums2.length;              // size of second array

        int[] merged = new int[m + n];     // new array to store merged elements

        int i = 0;                         // pointer for nums1
        int j = 0;                         // pointer for nums2
        int k = 0;                         // pointer for merged array

        // Merge both sorted arrays
        while (i < m && j < n) {

            // If current element in nums1 is smaller
            if (nums1[i] <= nums2[j]) {
                merged[k] = nums1[i];      // put nums1 element into merged
                i++;                       // move nums1 pointer
            } else {
                merged[k] = nums2[j];      // put nums2 element into merged
                j++;                       // move nums2 pointer
            }

            k++;                           // move merged pointer
        }

        // Copy remaining elements from nums1
        while (i < m) {
            merged[k] = nums1[i];
            i++;
            k++;
        }

        // Copy remaining elements from nums2
        while (j < n) {
            merged[k] = nums2[j];
            j++;
            k++;
        }

        int total = m + n;                 // total number of elements

        // If total elements are odd
        if (total % 2 == 1) {
            return merged[total / 2];      // middle element is median
        }

        // If total elements are even
        int mid1 = merged[total / 2 - 1];  // first middle element
        int mid2 = merged[total / 2];      // second middle element

        return (mid1 + mid2) / 2.0;        // average of both middles
    }
}`,

  optimalComplexity: `Time Complexity: O(log(min(m,n)))
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        int m = nums1.length, n = nums2.length;
        int low = 0, high = m;
        
        while (low <= high) {
            int partitionX = low + (high - low) / 2;
            int partitionY = (m + n + 1) / 2 - partitionX;
            
            int maxLeftX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
            int minRightX = (partitionX == m) ? Integer.MAX_VALUE : nums1[partitionX];
            
            int maxLeftY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
            int minRightY = (partitionY == n) ? Integer.MAX_VALUE : nums2[partitionY];
            
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((m + n) % 2 == 0) {
                    return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2.0;
                } else {
                    return Math.max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                high = partitionX - 1;
            } else {
                low = partitionX + 1;
            }
        }
        return 0.0;
    }
}`
},


{
  title: `QUESTION:
Given two sorted arrays arr1 and arr2 of size m and n respectively and an integer k. Find the kth smallest element in the merged sorted array.

EXAMPLE:
Input: arr1 = [2,3,6,7,9], arr2 = [1,4,8,10], k = 5
Output: 6`,

  bruteForceComplexity: `Time Complexity: O(m + n)
Space Complexity: O(m + n)`,

  bruteForceCode: `// Merge both arrays and return (k-1)th element`,

  optimalComplexity: `Time Complexity: O(log(min(m,n)))
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public int kthElement(int[] arr1, int[] arr2, int k) {
        if (arr1.length > arr2.length) {
            return kthElement(arr2, arr1, k);
        }
        int m = arr1.length, n = arr2.length;
        int low = Math.max(0, k - n), high = Math.min(k, m);
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int partitionY = k - mid;
            
            int maxLeft1 = (mid == 0) ? Integer.MIN_VALUE : arr1[mid - 1];
            int minRight1 = (mid == m) ? Integer.MAX_VALUE : arr1[mid];
            
            int maxLeft2 = (partitionY == 0) ? Integer.MIN_VALUE : arr2[partitionY - 1];
            int minRight2 = (partitionY == n) ? Integer.MAX_VALUE : arr2[partitionY];
            
            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                return Math.max(maxLeft1, maxLeft2);
            } else if (maxLeft1 > minRight2) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return -1;
    }
}`
},
{
  title: `QUESTION:
Given a binary matrix (0s and 1s) of size n x m where each row is sorted in non-decreasing order. Find the 0-based index of the row which has the maximum number of 1's. If multiple rows have the same number of 1's, return the smallest index.

EXAMPLE:
Input: matrix = [[0,1,1,1], [0,0,1,1], [1,1,1,1], [0,0,0,0]]
Output: 2`,

  bruteForceComplexity: `Time Complexity: O(N * M)
Space Complexity: O(1)`,

  bruteForceCode: `class Solution {
    public int rowWithMax1s(int[][] mat) {
        int n = mat.length;
        int m = mat[0].length;
        int maxCount = -1;
        int rowIndex = -1;
        
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < m; j++) {
                if (mat[i][j] == 1) count++;
            }
            if (count > maxCount) {
                maxCount = count;
                rowIndex = i;
            }
        }
        return rowIndex;
    }
}`,

  optimalComplexity: `Time Complexity: O(N + M)
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public int rowWithMax1s(int[][] mat) {
        int n = mat.length;
        int m = mat[0].length;
        int maxCount = -1;
        int rowIndex = -1;
        int col = m - 1;
        
        for (int i = 0; i < n; i++) {
            while (col >= 0 && mat[i][col] == 1) {
                col--;
            }
            int count = m - col - 1;
            if (count > maxCount) {
                maxCount = count;
                rowIndex = i;
            }
        }
        return rowIndex;
    }
}`
},


{
  title: `QUESTION:
Write an efficient algorithm to search for a target value in an m x n integer matrix. The matrix has the following properties:
- Integers in each row are sorted from left to right.
- The first integer of each row is greater than the last integer of the previous row.

EXAMPLE:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true`,

  bruteForceComplexity: `Time Complexity: O(N * M)
Space Complexity: O(1)`,

  bruteForceCode: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        for (int[] row : matrix) {
            for (int num : row) {
                if (num == target) return true;
            }
        }
        return false;
    }
}`,

  optimalComplexity: `Time Complexity: O(log(N * M))
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (matrix.length == 0) return false;
        int n = matrix.length;
        int m = matrix[0].length;
        int low = 0, high = n * m - 1;
        
        while (low <= high) {                         // considering as 1D array
            int mid = low + (high - low) / 2;         // here considering mid as index pos
            int row = mid / m;                        // row index
            int col = mid % m;                        // col index
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
}`
},



{
  title: `QUESTION:
Write an efficient algorithm to search for a target value in an m x n integer matrix. The matrix has the following properties:
- Integers in each row are sorted in ascending order from left to right.
- Integers in each column are sorted in ascending order from top to bottom.

EXAMPLE:
Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
Output: true`,

  bruteForceComplexity: `Time Complexity: O(N * M)
Space Complexity: O(1)`,

  bruteForceCode: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        for (int[] row : matrix) {
            for (int num : row) {
                if (num == target) return true;
            }
        }
        return false;
    }
}`,

  optimalComplexity: `Time Complexity: O(N + M)
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (matrix.length == 0) return false;
        int row = 0;
        int col = matrix[0].length - 1;
        
        while (row < matrix.length && col >= 0) {
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] > target) col--;
            else row++;
        }
        return false;
    }
}`
},


{
  title: `QUESTION:
A peak element in a 2D grid is an element that is strictly greater than all of its adjacent neighbors (up, down, left, right). Find any peak element and return its 0-based index [row, col].

EXAMPLE:
Input: mat = [[1,4],[3,2]]
Output: [0,1]`,

  bruteForceComplexity: `Time Complexity: O(N * M)
Space Complexity: O(1)`,

  bruteForceCode: `class Solution {
    public int[] findPeakGrid(int[][] mat) {
        int n = mat.length;
        int m = mat[0].length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                boolean isPeak = true;
                if (i > 0 && mat[i][j] <= mat[i-1][j]) isPeak = false;
                if (i < n-1 && mat[i][j] <= mat[i+1][j]) isPeak = false;
                if (j > 0 && mat[i][j] <= mat[i][j-1]) isPeak = false;
                if (j < m-1 && mat[i][j] <= mat[i][j+1]) isPeak = false;
                if (isPeak) return new int[]{i, j};
            }
        }
        return new int[]{-1, -1};
    }
}`,

  optimalComplexity: `Time Complexity: O(N log M) or O(M log N)
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public int[] findPeakGrid(int[][] mat) {
        int n = mat.length;
        int m = mat[0].length;
        int low = 0, high = m - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;           // Find Maximum Element in Column (mid)
            int maxRow = 0;
            for (int i = 0; i < n; i++) {
                if (mat[i][mid] > mat[maxRow][mid]) {
                    maxRow = i;
                }
            }
            
            boolean isPeak = true;
            if (mid > 0 && mat[maxRow][mid] < mat[maxRow][mid-1]) {         // if left > than mid (peak emement)
                high = mid - 1;
                isPeak = false;
            } else if (mid < m-1 && mat[maxRow][mid] < mat[maxRow][mid+1]) {     // if right > than mid (peak emement)
                low = mid + 1;
                isPeak = false;
            }
            
            if (isPeak) return new int[]{maxRow, mid};
        }
        return new int[]{-1, -1};
    }
}`
},


{
  title: `QUESTION:
Given a row-wise sorted matrix of odd size (n x m), find the median of all elements in the matrix. Assume n*m is odd.

EXAMPLE:
Input: matrix = [[1,3,5], [2,6,9], [3,6,9]]
Output: 5`,

  bruteForceComplexity: `Time Complexity: O(N*M log(N*M))
Space Complexity: O(N*M)`,

  bruteForceCode: `class Solution {
    public int matrixMedian(int[][] mat) {
        List<Integer> list = new ArrayList<>();
        for (int[] row : mat) {
            for (int num : row) list.add(num);
        }
        Collections.sort(list);
        return list.get(list.size() / 2);
    }
}`,

  optimalComplexity: `Time Complexity: O((N + M) * log(Max - Min))
Space Complexity: O(1)`,

  optimalCode: `class Solution {
    public int matrixMedian(int[][] mat) {
        int n = mat.length;
        int m = mat[0].length;
        int low = Integer.MAX_VALUE, high = Integer.MIN_VALUE;
        
        for (int i = 0; i < n; i++) {
            low = Math.min(low, mat[i][0]);
            high = Math.max(high, mat[i][m-1]);
        }
        
        int required = (n * m + 1) / 2;
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            int count = countSmallerEquals(mat, mid);
            if (count < required) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
    
    private int countSmallerEquals(int[][] mat, int x) {
        int count = 0;
        for (int[] row : mat) {                             // here we r chaecking that how many no. r <= x
            int low = 0, high = row.length - 1;
            while (low <= high) {
                int mid = low + (high - low) / 2;
                if (row[mid] <= x) low = mid + 1;
                else high = mid - 1;
            }
            count += low;
        }
        return count;
    }
}`
}

  ],



  "strings":[
    {
      title: `QUESTION:
    Given a string s, sort it in decreasing order based on the frequency of the characters. If two characters have the same frequency, their relative order does not matter.
    
    EXAMPLE:
    Input: s = "tree"
    Output: "eert"
    Explanation: 'e' appears twice, 'r' and 't' appear once each.`,
    
      bruteForceComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public String frequencySort(String s) {
            Map<Character, Integer> freq = new HashMap<>();
            for (char c : s.toCharArray()) {
                freq.put(c, freq.getOrDefault(c, 0) + 1);
            }
            List<Character> chars = new ArrayList<>(freq.keySet());
            chars.sort((a, b) -> freq.get(b) - freq.get(a));
            StringBuilder sb = new StringBuilder();
            for (char c : chars) {
                for (int i = 0; i < freq.get(c); i++) sb.append(c);
            }
            return sb.toString();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public String frequencySort(String s) {
            Map<Character, Integer> freq = new HashMap<>();
            for (char c : s.toCharArray()) {
                freq.put(c, freq.getOrDefault(c, 0) + 1);
            }
            
            List<Character>[] bucket = new List[s.length() + 1];
            for (char c : freq.keySet()) {
                int count = freq.get(c);
                if (bucket[count] == null) bucket[count] = new ArrayList<>();
                bucket[count].add(c);
            }
            
            StringBuilder sb = new StringBuilder();
            for (int i = bucket.length - 1; i >= 0; i--) {
                if (bucket[i] != null) {
                    for (char c : bucket[i]) {
                        for (int j = 0; j < i; j++) sb.append(c);
                    }
                }
            }
            return sb.toString();
        }
    }`
    },


    {
      title: `QUESTION:
    A string is a valid parentheses string if it can be parsed as a valid parentheses sequence. Return the maximum nesting depth of the valid parentheses string.
    
    EXAMPLE:
    Input: s = "(1+(2*3)+((8)/4))+1"
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Same as optimal for this problem`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxDepth(String s) {
            int maxDepth = 0;
            int currentDepth = 0;
            for (char c : s.toCharArray()) {
                if (c == '(') {
                    currentDepth++;
                    maxDepth = Math.max(maxDepth, currentDepth);
                } else if (c == ')') {
                    currentDepth--;
                }
            }
            return maxDepth;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a Roman numeral, convert it to an integer.
    
    EXAMPLE:
    Input: s = "III"
    Output: 3
    Input: s = "LVIII"
    Output: 58`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int romanToInt(String s) {
            Map<Character, Integer> map = new HashMap<>();
            map.put('I', 1); map.put('V', 5); map.put('X', 10);
            map.put('L', 50); map.put('C', 100); map.put('D', 500); map.put('M', 1000);
            
            int total = 0;
            for (int i = 0; i < s.length(); i++) {
                if (i + 1 < s.length() && map.get(s.charAt(i)) < map.get(s.charAt(i+1))) {
                    total -= map.get(s.charAt(i));
                } else {
                    total += map.get(s.charAt(i));
                }
            }
            return total;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `// Same as above (optimal)` 
    },


    {
      title: `QUESTION:
    Implement the myAtoi function that converts a string to a 32-bit signed integer.
    
    EXAMPLE:
    Input: s = "42"
    Output: 42
    Input: s = "   -42"
    Output: -42`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int myAtoi(String s) {
            s = s.trim();
            if (s.isEmpty()) return 0;
            int i = 0, sign = 1;
            long result = 0;
            if (s.charAt(0) == '-' || s.charAt(0) == '+') {
                sign = (s.charAt(0) == '-') ? -1 : 1;
                i++;
            }
            while (i < s.length() && Character.isDigit(s.charAt(i))) {
                result = result * 10 + (s.charAt(i) - '0');
                if (result > Integer.MAX_VALUE) {
                    return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
                }
                i++;
            }
            return (int)(result * sign);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `// Same as brute force (this is the standard optimal)` 
    },

    {
      title: `QUESTION:
    Given a string s, count the total number of substrings that contain only one distinct character.
    
    EXAMPLE:
    Input: s = "aaaba"
    Output: 8
    Explanation: substrings: "a","a","aa","aaa","b","aa","a","a"`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public long countSubstrings(String s) {
            int n = s.length();
            long count = 0;
            for (int i = 0; i < n; i++) {
                for (int j = i; j < n; j++) {
                    if (isSingleChar(s, i, j)) count++;
                }
            }
            return count;
        }
        private boolean isSingleChar(String s, int i, int j) {
            char c = s.charAt(i);
            for (int k = i; k <= j; k++) if (s.charAt(k) != c) return false;
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public long countSubstrings(String s) {
            long count = 0;
            int n = s.length();
            for (int i = 0; i < n; ) {
                int j = i;
                while (j < n && s.charAt(j) == s.charAt(i)) j++;
                long len = j - i;
                count += len * (len + 1) / 2;
                i = j;
            }
            return count;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a string s, return the longest palindromic substring in s.
    
    EXAMPLE:
    Input: s = "babad"
    Output: "bab"`,
    
      bruteForceComplexity: `Time Complexity: O(N³)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Check every substring if palindrome`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public String longestPalindrome(String s) {
            if (s == null || s.length() < 1) return "";
            int start = 0, end = 0;
            for (int i = 0; i < s.length(); i++) {
                int len1 = expandAroundCenter(s, i, i);
                int len2 = expandAroundCenter(s, i, i + 1);
                int len = Math.max(len1, len2);
                if (len > end - start) {
                    start = i - (len - 1) / 2;
                    end = i + len / 2;
                }
            }
            return s.substring(start, end + 1);
        }
        
        private int expandAroundCenter(String s, int left, int right) {
            while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
                left--;
                right++;
            }
            return right - left - 1;
        }
    }`
    },


    {
      title: `QUESTION:
    The beauty of a substring is the difference between the frequency of the most frequent and least frequent character. Return the sum of beauty of all substrings.
    
    EXAMPLE:
    Input: s = "aabcb"
    Output: 5`,
    
      bruteForceComplexity: `Time Complexity: O(N³)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// For each substring, count freq and compute beauty`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int beautySum(String s) {
            int total = 0;
            int n = s.length();
            for (int i = 0; i < n; i++) {
                int[] freq = new int[26];
                for (int j = i; j < n; j++) {
                    freq[s.charAt(j) - 'a']++;
                    int maxF = 0, minF = Integer.MAX_VALUE;
                    for (int f : freq) {
                        if (f > 0) {
                            maxF = Math.max(maxF, f);
                            minF = Math.min(minF, f);
                        }
                    }
                    total += (maxF - minF);
                }
            }
            return total;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a string s, reverse the order of characters in each word within a sentence while preserving whitespace and initial word order.
    
    EXAMPLE:
    Input: s = "Let's take LeetCode contest"
    Output: "s'teL ekat edoCteeL tsetnoc"`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public String reverseWords(String s) {
            String[] words = s.trim().split("\\s+");
            StringBuilder sb = new StringBuilder();
            for (String word : words) {
                sb.append(new StringBuilder(word).reverse()).append(" ");
            }
            return sb.toString().trim();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `// Same as above (optimal)` 
    },


    {
      title: `QUESTION:
    Given a string expression consisting only of curly brackets '{' and '}'. Find the minimum number of bracket reversals required to make the expression balanced. If it is impossible, return -1.
    
    EXAMPLE:
    Input: s = "}{"
    Output: 2
    Input: s = "{{{}"
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int countMinReversals(String s) {
            if (s.length() % 2 != 0) return -1;
            Stack<Character> st = new Stack<>();
            for (char c : s.toCharArray()) {
                if (c == '{' ) st.push(c);
                else if (!st.isEmpty() && st.peek() == '{') st.pop();
                else st.push(c);
            }
            // This is not accurate brute - use DP or optimized below
            return -1;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int countMinReversals(String s) {
            if (s.length() % 2 != 0) return -1;
            int open = 0, close = 0;
            for (char c : s.toCharArray()) {
                if (c == '{') open++;
                else {
                    if (open > 0) open--;
                    else close++;
                }
            }
            return (open + 1) / 2 + (close + 1) / 2;
        }
    }`
    },


    {
      title: `QUESTION:
    The count-and-say sequence is a sequence of digit strings defined by the recursive formula: countAndSay(1) = "1", countAndSay(n) is the description of the previous term. Given a positive integer n, return the nth term of the count-and-say sequence.
    
    EXAMPLE:
    Input: n = 4
    Output: "1211"
    Explanation: 
    countAndSay(1) = "1"
    countAndSay(2) = "11"
    countAndSay(3) = "21"
    countAndSay(4) = "1211"`,
    
      bruteForceComplexity: `Time Complexity: O(N * L) where L is length of string
    Space Complexity: O(L)`,
    
      bruteForceCode: `class Solution {
        public String countAndSay(int n) {
            String s = "1";
            for (int i = 1; i < n; i++) {
                s = generateNext(s);
            }
            return s;
        }
        
        private String generateNext(String s) {
            StringBuilder sb = new StringBuilder();
            int count = 1;
            for (int i = 1; i < s.length(); i++) {
                if (s.charAt(i) == s.charAt(i-1)) count++;
                else {
                    sb.append(count).append(s.charAt(i-1));
                    count = 1;
                }
            }
            sb.append(count).append(s.charAt(s.length()-1));
            return sb.toString();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * L)
    Space Complexity: O(L)`,
    
      optimalCode: `// Same as above (this is the standard solution)`
    },


    {
      title: `QUESTION:
    Implement Rabin-Karp algorithm to find all occurrences of pattern in text.
    
    EXAMPLE:
    Input: text = "ABABDABACDABABCABAB", pattern = "ABABCABAB"
    Output: Pattern found at index 10`,
    
      bruteForceComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Simple nested loop string matching`,
    
      optimalComplexity: `Time Complexity: O(N + M) average
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public List<Integer> rabinKarp(String text, String pattern) {
            List<Integer> result = new ArrayList<>();
            int n = text.length(), m = pattern.length();
            if (m > n) return result;
            
            int d = 256;
            int q = 101; // prime
            int p = 0, t = 0, h = 1;
            
            for (int i = 0; i < m - 1; i++) h = (h * d) % q;
            
            for (int i = 0; i < m; i++) {
                p = (d * p + pattern.charAt(i)) % q;
                t = (d * t + text.charAt(i)) % q;
            }
            
            for (int i = 0; i <= n - m; i++) {
                if (p == t) {
                    boolean match = true;
                    for (int j = 0; j < m; j++) {
                        if (text.charAt(i + j) != pattern.charAt(j)) {
                            match = false;
                            break;
                        }
                    }
                    if (match) result.add(i);
                }
                if (i < n - m) {
                    t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
                    if (t < 0) t += q;
                }
            }
            return result;
        }
    }`
    },


    {
      title: `QUESTION:
    Compute the Z-array for a given string. Z[i] is the length of the longest substring starting from i which is also a prefix of the string.
    
    EXAMPLE:
    Input: s = "aabcaabxaaz"
    Output: [0,1,0,0,0,2,1,0,0,1,0]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Naive comparison for each i`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int[] zFunction(String s) {
            int n = s.length();
            int[] z = new int[n];
            int l = 0, r = 0;
            for (int i = 1; i < n; i++) {
                if (i < r) z[i] = Math.min(r - i, z[i - l]);
                while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
                if (i + z[i] > r) {
                    l = i;
                    r = i + z[i];
                }
            }
            return z;
        }
    }`
    },


    {
      title: `QUESTION:
    Implement KMP (Knuth-Morris-Pratt) algorithm to search pattern in text using LPS (Longest Prefix Suffix) array.
    
    EXAMPLE:
    Input: text = "ABABDABACDABABCABAB", pattern = "ABABCABAB"
    Output: Pattern found at index 10`,
    
      bruteForceComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Naive string matching`,
    
      optimalComplexity: `Time Complexity: O(N + M)
    Space Complexity: O(M)`,
    
      optimalCode: `class Solution {
        public List<Integer> KMPSearch(String text, String pattern) {
            List<Integer> result = new ArrayList<>();
            int[] lps = computeLPS(pattern);
            int i = 0, j = 0;
            while (i < text.length()) {
                if (pattern.charAt(j) == text.charAt(i)) {
                    i++; j++;
                }
                if (j == pattern.length()) {
                    result.add(i - j);
                    j = lps[j - 1];
                } else if (i < text.length() && pattern.charAt(j) != text.charAt(i)) {
                    if (j != 0) j = lps[j - 1];
                    else i++;
                }
            }
            return result;
        }
        
        private int[] computeLPS(String pattern) {
            int m = pattern.length();
            int[] lps = new int[m];
            int len = 0, i = 1;
            while (i < m) {
                if (pattern.charAt(i) == pattern.charAt(len)) {
                    len++;
                    lps[i] = len;
                    i++;
                } else {
                    if (len != 0) len = lps[len - 1];
                    else {
                        lps[i] = 0;
                        i++;
                    }
                }
            }
            return lps;
        }
    }`
    },


    {
      title: `QUESTION:
    You are given a string s. You can convert it to a palindrome by adding characters in front of it. Return the shortest palindrome you can find by performing this transformation.
    
    EXAMPLE:
    Input: s = "aacecaaa"
    Output: "aaacecaaa"`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Check all prefixes if palindrome`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public String shortestPalindrome(String s) {
            String rev = new StringBuilder(s).reverse().toString();
            String combined = s + "#" + rev;
            int[] lps = computeLPS(combined);
            int palinLen = lps[lps.length - 1];
            return rev.substring(0, s.length() - palinLen) + s;
        }
        
        private int[] computeLPS(String s) {
            int n = s.length();
            int[] lps = new int[n];
            int len = 0, i = 1;
            while (i < n) {
                if (s.charAt(i) == s.charAt(len)) {
                    len++;
                    lps[i] = len;
                    i++;
                } else {
                    if (len != 0) len = lps[len - 1];
                    else i++;
                }
            }
            return lps;
        }
    }`
    },


    {
      title: `QUESTION:
    A string is called a happy prefix if it is a non-empty prefix which is also a suffix (and not the entire string). Return the longest happy prefix of s. Return empty string if no such prefix exists.
    
    EXAMPLE:
    Input: s = "level"
    Output: "l"
    Input: s = "ababab"
    Output: "abab"`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Check all possible prefix lengths`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public String longestPrefix(String s) {
            int n = s.length();
            int[] lps = new int[n];
            int len = 0, i = 1;
            while (i < n) {
                if (s.charAt(i) == s.charAt(len)) {
                    len++;
                    lps[i] = len;
                    i++;
                } else {
                    if (len != 0) len = lps[len - 1];
                    else i++;
                }
            }
            int longest = lps[n - 1];
            return longest == 0 ? "" : s.substring(0, longest);
        }
    }`
    },

    {
      title: `QUESTION:
    Given a string s, return the number of different non-empty palindromic subsequences in s. Return the answer modulo 10^9 + 7.
    
    EXAMPLE:
    Input: s = "bccb"
    Output: 6
    Explanation: The 6 different non-empty palindromic subsequences are 'b', 'c', 'bb', 'cc', 'bcb', 'bccb'.`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Recursion with all subsequences`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int countPalindromicSubsequences(String s) {
            int n = s.length();
            int MOD = 1000000007;
            int[][] dp = new int[n][n];
            
            for (int i = 0; i < n; i++) dp[i][i] = 1;
            
            for (int len = 2; len <= n; len++) {
                for (int i = 0; i <= n - len; i++) {
                    int j = i + len - 1;
                    if (s.charAt(i) == s.charAt(j)) {
                        int left = i + 1, right = j - 1;
                        while (left <= right && s.charAt(left) != s.charAt(i)) left++;
                        while (left <= right && s.charAt(right) != s.charAt(i)) right--;
                        
                        if (left > right) dp[i][j] = dp[i+1][j-1] * 2 + 2;
                        else if (left == right) dp[i][j] = dp[i+1][j-1] * 2 + 1;
                        else dp[i][j] = dp[i+1][j-1] * 2 - dp[left+1][right-1];
                    } else {
                        dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1];
                    }
                    dp[i][j] = (dp[i][j] + MOD) % MOD;
                }
            }
            return dp[0][n-1];
        }
    }`
    }

  ],



  "linked-list":[
    {
      title: `QUESTION:
    Given a doubly linked list and a key, delete all occurrences of the key from the DLL.
    
    EXAMPLE:
    Input: DLL: 2 <-> 2 <-> 10 <-> 8 <-> 4 <-> 2 <-> 5 <-> 2, key = 2
    Output: 10 <-> 8 <-> 4 <-> 5`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public Node deleteAllOccurOfX(Node head, int x) {
            Node temp = head;
            while (temp != null) {
                if (temp.data == x) {
                    Node next = temp.next;
                    Node prev = temp.prev;
                    if (prev != null) prev.next = next;
                    if (next != null) next.prev = prev;
                    if (temp == head) head = next;
                    temp = next;
                } else {
                    temp = temp.next;
                }
            }
            return head;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public Node deleteAllOccurOfX(Node head, int x) {
            Node curr = head;
            while (curr != null) {
                if (curr.data == x) {
                    if (curr.prev != null) {
                        curr.prev.next = curr.next;
                    }
                    if (curr.next != null) {
                        curr.next.prev = curr.prev;
                    }
                    if (curr == head) {
                        head = curr.next;
                    }
                }
                curr = curr.next;
            }
            return head;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a sorted doubly linked list and a target sum, find all pairs of nodes whose sum equals the target.
    
    EXAMPLE:
    Input: DLL: 1 <-> 2 <-> 4 <-> 5 <-> 6 <-> 8 <-> 9, target = 7
    Output: [[1,6], [2,5]]`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> findPairsWithGivenSum(Node head, int target) {
            List<List<Integer>> result = new ArrayList<>();
            Node temp1 = head;
            while (temp1 != null) {
                Node temp2 = temp1.next;
                while (temp2 != null) {
                    if (temp1.data + temp2.data == target) {
                        result.add(Arrays.asList(temp1.data, temp2.data));
                    }
                    temp2 = temp2.next;
                }
                temp1 = temp1.next;
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> findPairsWithGivenSum(Node head, int target) {
            List<List<Integer>> result = new ArrayList<>();
            if (head == null) return result;
            
            Node left = head;
            Node right = head;
            while (right.next != null) right = right.next;
            
            while (left != right && left.prev != right) {
                int sum = left.data + right.data;
                if (sum == target) {
                    result.add(Arrays.asList(left.data, right.data));
                    left = left.next;
                    right = right.prev;
                } else if (sum < target) {
                    left = left.next;
                } else {
                    right = right.prev;
                }
            }
            return result;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a sorted doubly linked list, remove all duplicate nodes so that each element appears only once.
    
    EXAMPLE:
    Input: DLL: 1 <-> 1 <-> 1 <-> 2 <-> 3 <-> 3 <-> 4
    Output: 1 <-> 2 <-> 3 <-> 4`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public Node removeDuplicates(Node head) {
            Node curr = head;
            while (curr != null && curr.next != null) {
                if (curr.data == curr.next.data) {
                    curr.next = curr.next.next;
                    if (curr.next != null) {
                        curr.next.prev = curr;
                    }
                } else {
                    curr = curr.next;
                }
            }
            return head;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public Node removeDuplicates(Node head) {
            if (head == null) return null;
            
            Node curr = head;
            while (curr.next != null) {
                if (curr.data == curr.next.data) {
                    Node nextNext = curr.next.next;
                    curr.next = nextNext;
                    if (nextNext != null) {
                        nextNext.prev = curr;
                    }
                } else {
                    curr = curr.next;
                }
            }
            return head;
        }
    }`
    },

    {
      title: `QUESTION:
    Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. If the number of nodes is not a multiple of k, then leave the last nodes as it is.
    
    EXAMPLE:
    Input: head = [1,2,3,4,5], k = 2
    Output: [2,1,4,3,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Iterative reversal in groups of k`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public Node reverseKGroup(Node head, int k) {
            if (head == null || k == 1) return head;
            
            Node dummy = new Node(0);
            dummy.next = head;
            Node prev = dummy, curr = head, next = null;
            
            // Count nodes
            int count = 0;
            while (curr != null) {
                count++;
                curr = curr.next;
            }
            
            while (count >= k) {
                curr = prev.next;
                next = curr.next;
                
                for (int i = 1; i < k; i++) {
                    curr.next = next.next;
                    next.next = prev.next;
                    prev.next = next;
                    next = curr.next;
                }
                
                prev = curr;
                count -= k;
            }
            return dummy.next;
        }
    }`
    },



    {
      title: `QUESTION:
    Given the head of a linked list, rotate the list to the right by k places.
    
    EXAMPLE:
    Input: head = [1,2,3,4,5], k = 2
    Output: [4,5,1,2,3]`,
    
      bruteForceComplexity: `Time Complexity: O(N * K)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Rotate one by one k times`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public Node rotateRight(Node head, int k) {
            if (head == null || head.next == null || k == 0) return head;
            
            // Find length
            int len = 1;
            Node tail = head;
            while (tail.next != null) {
                tail = tail.next;
                len++;
            }
            
            k = k % len;
            if (k == 0) return head;
            
            // Find new tail
            Node newTail = head;
            for (int i = 1; i < len - k; i++) {
                newTail = newTail.next;
            }
            
            Node newHead = newTail.next;
            newTail.next = null;
            tail.next = head;
            
            return newHead;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a linked list where each node has a next pointer and a child pointer (forming a multilevel structure), flatten it into a single-level sorted linked list.
    
    EXAMPLE:
    Input: 1 -> 2 -> 3 -> 4
              |
              5 -> 6
    Output: 1 -> 2 -> 3 -> 4 -> 5 -> 6`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) using sorting`,
    
      bruteForceCode: `// Collect all nodes and sort`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public Node flatten(Node head) {
            if (head == null) return null;
            
            Node curr = head;
            while (curr != null) {
                if (curr.child != null) {
                    Node next = curr.next;
                    Node childTail = curr.child;
                    
                    while (childTail.next != null) {
                        childTail = childTail.next;
                    }
                    
                    curr.next = curr.child;
                    curr.child.prev = curr;
                    childTail.next = next;
                    if (next != null) next.prev = childTail;
                    
                    curr.child = null;
                }
                curr = curr.next;
            }
            return head;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a linked list with next and random pointers, create a deep copy of the list.
    
    EXAMPLE:
    Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
    Output: Deep copy of the list`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Using HashMap`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public Node copyRandomList(Node head) {
            if (head == null) return null;
            
            // Step 1: Insert copy nodes
            Node curr = head;
            while (curr != null) {
                Node copy = new Node(curr.val);
                copy.next = curr.next;
                curr.next = copy;
                curr = copy.next;
            }
            
            // Step 2: Set random pointers
            curr = head;
            while (curr != null) {
                if (curr.random != null) {
                    curr.next.random = curr.random.next;
                }
                curr = curr.next.next;
            }
            
            // Step 3: Separate original and copy list
            Node dummy = new Node(0);
            Node copyCurr = dummy;
            curr = head;
            
            while (curr != null) {
                copyCurr.next = curr.next;
                copyCurr = copyCurr.next;
                curr.next = curr.next.next;
                curr = curr.next;
            }
            
            return dummy.next;
        }
    }`
    }

  ],

  "bit-manipulation":[
    {
      title: `QUESTION:
    Complete Bit Manipulation Theory - All Important Concepts, Tricks, and Techniques (Must Know for Interviews)`,
    
      bruteForceComplexity: `Not Applicable (Theory)`,
    
      bruteForceCode: `// Theory Section`,
    
      optimalComplexity: `Master These Concepts`,
    
      optimalCode: `// ====================================
    // BIT MANIPULATION COMPLETE THEORY
    // ====================================
    
    // 1. Basic Operators
    &   -> AND (both 1)
    |   -> OR  (at least one 1)
    ^   -> XOR (different bits)  (when same then 0 and when diff then 1)
    ~   -> NOT (invert all bits)
    <<  -> Left Shift  (multiply by 2^k)  (12=1100,  12<<1 = 11000(24)  or  12*2^1=24)
    >>  -> Right Shift (divide by 2^k, preserves sign)    (12=1100,  12>>1=0110(6)  or  12/2^1=6)
    >>> -> Unsigned Right Shift
    
    // 2. Key Properties
    x ^ x = 0
    x ^ 0 = x
    x & (x-1) = removes rightmost set bit
    x & -x = gives rightmost set bit
    x | (x-1) = sets all bits after rightmost set bit
    
    // 3. Important Techniques
    Check if power of 2
    bool isPowerOf2 = (n > 0) && (n & (n-1)) == 0;
    
    // Count set bits (Brian Kernighan)
    int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n = n & (n-1);
            count++;
        }
        return count;
    }
    
    // Get ith bit
    int getBit(int n, int i) {
        return (n & (1 << i)) != 0 ? 1 : 0;
    }
    
    // Set ith bit
    int setBit(int n, int i) {
        return n | (1 << i);
    }
    
    // Clear ith bit
    int clearBit(int n, int i) {
        return n & ~(1 << i);
    }
    
    // Toggle ith bit
    int toggleBit(int n, int i) {
        return n ^ (1 << i);
    }
    
    // Swap two numbers without temp
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    
    // Find missing number in 1 to n
    int missing = 0;
    for (int num : arr) missing ^= num;
    for (int i = 1; i <= n; i++) missing ^= i;
    
    // Single Number I (appears once, others twice)
    int single = 0;
    for (int num : nums) single ^= num;
    
    // Single Number II (appears once, others thrice)
    int ones = 0, twos = 0;
    for (int num : nums) {
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    
    // Check opposite signs
    bool opposite = (x ^ y) < 0;
    
    // ====================================
    `
    },


    {
      title: `QUESTION:
    Given two integers start and goal, return the minimum number of bit flips to convert start to goal.
    
    EXAMPLE:
    Input: start = 10, goal = 7
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(log N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int minBitFlips(int start, int goal) {
            int xor = start ^ goal;
            int count = 0;
            while (xor > 0) {
                count += xor & 1;
                xor >>= 1;
            }
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(1)  // Brian Kernighan
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {              //Number of flips required = Number of 1s in (start ^ goal)
        public int minBitFlips(int start, int goal) {
            int xor = start ^ goal;                // 10=1010 and 7=0111   ans=3 diff bits
            int count = 0;
            while (xor > 0) {
                xor = xor & (xor - 1);   // 12 to 11 (xor=12 (1100) then xor-1=11 (1011))
                count++;
            }
            return count;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.
    
    EXAMPLE:
    Input: nums = [2,2,1]
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) (using HashMap)`,
    
      bruteForceCode: `// Using HashMap`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int singleNumber(int[] nums) {
            int ans = 0;
            for (int num : nums) {
                ans ^= num;   // XOR property: x^x=0, x^0=x
            }
            return ans;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an integer array nums of unique elements, return all possible subsets (the power set).
    
    EXAMPLE:
    Input: nums = [1,2,3]
    Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`,
    
      bruteForceComplexity: `Time Complexity: O(N * 2^N)
    Space Complexity: O(N * 2^N)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> subsets(int[] nums) {
            List<List<Integer>> result = new ArrayList<>();
            int n = nums.length;
            for (int i = 0; i < (1 << n); i++) {   // 0 to 2^n - 1
                List<Integer> subset = new ArrayList<>();
                for (int j = 0; j < n; j++) {
                    if ((i & (1 << j)) != 0) {
                        subset.add(nums[j]);
                    }
                }
                result.add(subset);
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * 2^N)
    Space Complexity: O(N * 2^N)`,
    
      optimalCode: `// Same as above (Bit Manipulation is optimal for Power Set)`
    },



    {
      title: `QUESTION:
    Given two integers L and R, find the XOR of all numbers from L to R (inclusive).
    
    EXAMPLE:
    Input: L = 4, R = 7
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int xorRange(int L, int R) {
            int xor = 0;
            for (int i = L; i <= R; i++) xor ^= i;
            return xor;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(1)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int findXOR(int L, int R) {
            return xorUpto(R) ^ xorUpto(L-1);
        }
        
        private int xorUpto(int n) {
            if (n < 0) return 0;
            int mod = n % 4;
            if (mod == 0) return n;
            else if (mod == 1) return 1;
            else if (mod == 2) return n + 1;
            else return 0;
        }
    }`
    },



    {
      title: `QUESTION:
    Given an integer array nums, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once.
    
    EXAMPLE:
    Input: nums = [1,2,1,3,2,5]
    Output: [3,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Using HashMap`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int[] singleNumber(int[] nums) {
            int xor = 0;
            for (int num : nums) xor ^= num;
            
            // Find rightmost set bit
            int rightmost = xor & -xor;        // for -xor  1. 1's complement then add 1 
                                              // ex: -6(0110)= 1001(9) + 1 =1010
            int num1 = 0, num2 = 0;
            for (int num : nums) {
                if ((num & rightmost) != 0) {
                    num1 ^= num;
                } else {
                    num2 ^= num;
                }
            }
            return new int[]{num1, num2};
        }
    }`
    },


    {
      title: `QUESTION:
    Given a number n, print all its prime factors in ascending order.
    
    EXAMPLE:
    Input: n = 12 (2x6=2x2x3)
    Output: 2 2 3`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> primeFactors(int n) {
            List<Integer> factors = new ArrayList<>();
            for (int i = 2; i <= n; i++) {
                while (n % i == 0) {
                    factors.add(i);
                    n /= i;
                }
            }
            return factors;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(√N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public List<Integer> primeFactors(int n) {
            List<Integer> factors = new ArrayList<>();
            
            // Handle factor 2
            while (n % 2 == 0) {
                factors.add(2);
                n /= 2;
            }
            
            // Handle odd factors
            for (int i = 3; i * i <= n; i += 2) {
                while (n % i == 0) {
                    factors.add(i);
                    n /= i;
                }
            }
            
            // If n is a prime number greater than 2
            if (n > 2) factors.add(n);
            
            return factors;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a number n, return all divisors of n in ascending order.
    
    EXAMPLE:
    Input: n = 12
    Output: [1, 2, 3, 4, 6, 12]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> divisors(int n) {
            List<Integer> list = new ArrayList<>();
            for (int i = 1; i <= n; i++) {
                if (n % i == 0) list.add(i);
            }
            return list;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(√N)
    Space Complexity: O(√N)`,
    
      optimalCode: `class Solution {
        public List<Integer> divisors(int n) {
            List<Integer> list = new ArrayList<>();
            
            for (int i = 1; i * i <= n; i++) {
                if (n % i == 0) {
                    list.add(i);
                    if (i != n / i) list.add(n / i);
                }
            }
            
            Collections.sort(list);
            return list;
        }
    }`
    },

    {
      title: `QUESTION:
    Given two integers L and R, count the number of prime numbers in the range [L, R] (inclusive).
    
    EXAMPLE:
    Input: L = 1, R = 10
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O((R-L+1) * √R)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int countPrimes(int L, int R) {
            int count = 0;
            for (int i = Math.max(L, 2); i <= R; i++) {
                if (isPrime(i)) count++;
            }
            return count;
        }
        
        private boolean isPrime(int n) {
            if (n <= 1) return false;
            for (int i = 2; i * i <= n; i++) {
                if (n % i == 0) return false;
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(R log log R) - Sieve
    Space Complexity: O(R)`,
    
      optimalCode: `class Solution {
        public int countPrimes(int L, int R) {
            if (R < 2) return 0;
            
            boolean[] isPrime = new boolean[R+1];
            Arrays.fill(isPrime, true);
            isPrime[0] = isPrime[1] = false;
            
            for (int i = 2; i * i <= R; i++) {
                if (isPrime[i]) {
                    for (int j = i*i; j <= R; j += i) {
                        isPrime[j] = false;
                    }
                }
            }
            
            int count = 0;
            for (int i = Math.max(L, 2); i <= R; i++) {
                if (isPrime[i]) count++;
            }
            return count;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a number n, return its prime factorization in the form of list of prime factors (with multiplicity).
    
    EXAMPLE:
    Input: n = 84
    Output: [2, 2, 3, 7]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(log N)`,
    
      bruteForceCode: `// Same as first problem`,
    
      optimalComplexity: `Time Complexity: O(√N)
    Space Complexity: O(log N)`,
    
      optimalCode: `class Solution {
        public List<Integer> primeFactorization(int n) {
            List<Integer> factors = new ArrayList<>();
            
            while (n % 2 == 0) {
                factors.add(2);
                n /= 2;
            }
            
            for (int i = 3; i * i <= n; i += 2) {
                while (n % i == 0) {
                    factors.add(i);
                    n /= i;
                }
            }
            
            if (n > 2) factors.add(n);
            
            return factors;
        }
    }`
    },



    {
      title: `QUESTION:
    Implement pow(x, n) which calculates x raised to the power n (x^n).
    
    EXAMPLE:
    Input: x = 2.00000, n = 10
    Output: 1024.00000`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public double myPow(double x, int n) {
            double ans = 1.0;
            long exp = Math.abs((long)n);
            for (long i = 0; i < exp; i++) {
                ans *= x;
            }
            return n < 0 ? 1 / ans : ans;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log N)
    Space Complexity: O(log N) (recursion stack)`,
    
      optimalCode: `class Solution {
        public double myPow(double x, int n) {
            if (n == 0) return 1.0;
            if (n < 0) {
                x = 1 / x;
                n = -n;
            }
            return fastPow(x, n);
        }
        
        private double fastPow(double x, long n) {
            if (n == 0) return 1.0;
            if (n == 1) return x;
            
            double half = fastPow(x, n / 2);
            if (n % 2 == 0) {
                return half * half;
            } else {
                return half * half * x;
            }
        }
    }`
    },

  ],

  "sliding-and-two-pointer":[
    {
      title: `QUESTION:
    Given a string s, find the length of the longest substring without repeating characters.
    
    EXAMPLE:
    Input: s = "abcabcbb"
    Output: 3
    Explanation: The answer is "abc", with length 3.`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(256) ≈ O(1)`,
    
      bruteForceCode: `class Solution {
        public int lengthOfLongestSubstring(String s) {
            int n = s.length();
            int maxLen = 0;
    
            for(int i = 0; i < n; i++) {
                HashSet<Character> set = new HashSet<>();
    
                for(int j = i; j < n; j++) {
                    if(set.contains(s.charAt(j))) {
                        break;
                    }
    
                    set.add(s.charAt(j));
                    maxLen = Math.max(maxLen, j - i + 1);
                }
            }
    
            return maxLen;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(256) ≈ O(1)`,
    
      optimalCode: `class Solution {
        public int lengthOfLongestSubstring(String s) {
            int[] lastIndex = new int[256];
            Arrays.fill(lastIndex, -1);
    
            int left = 0;
            int maxLen = 0;
    
            for(int right = 0; right < s.length(); right++) {
                char ch = s.charAt(right);
    
                if(lastIndex[ch] >= left) {         // intially for any lastIndex['a']=-1
                    left = lastIndex[ch] + 1;
                }
    
                lastIndex[ch] = right;
                maxLen = Math.max(maxLen, right - left + 1);
            }
    
            return maxLen;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.
    
    EXAMPLE:
    Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int longestOnes(int[] nums, int k) {
            int n = nums.length;
            int ans = 0;
    
            for(int i = 0; i < n; i++) {
                int zeros = 0;
    
                for(int j = i; j < n; j++) {
                    if(nums[j] == 0) zeros++;
    
                    if(zeros > k) break;
    
                    ans = Math.max(ans, j - i + 1);
                }
            }
    
            return ans;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int longestOnes(int[] nums, int k) {
            int left = 0;
            int zeros = 0;
            int ans = 0;
    
            for(int right = 0; right < nums.length; right++) {
                if(nums[right] == 0) zeros++;
    
                while(zeros > k) {
                    if(nums[left] == 0) zeros--;
                    left++;
                }
    
                ans = Math.max(ans, right - left + 1);
            }
    
            return ans;
        }
    }`
    },


    {
      title: `QUESTION:
    You are given an integer array fruits where fruits[i] is the type of fruit.
    You can pick fruits from a contiguous subarray containing at most 2 distinct fruit types.
    
    EXAMPLE:
    Input: fruits = [1,2,1,2,3]
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(2)`,
    
      bruteForceCode: `class Solution {
        public int totalFruit(int[] fruits) {
            int n = fruits.length;
            int ans = 0;
    
            for(int i = 0; i < n; i++) {
                HashMap<Integer,Integer> map = new HashMap<>();
    
                for(int j = i; j < n; j++) {
                    map.put(fruits[j], map.getOrDefault(fruits[j],0)+1);
    
                    if(map.size() > 2) break;
    
                    ans = Math.max(ans, j - i + 1);
                }
            }
    
            return ans;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(2)`,
    
      optimalCode: `class Solution {
        public int totalFruit(int[] fruits) {
            HashMap<Integer,Integer> map = new HashMap<>();
    
            int left = 0;
            int ans = 0;
    
            for(int right = 0; right < fruits.length; right++) {
                map.put(fruits[right],
                        map.getOrDefault(fruits[right],0)+1);
    
                while(map.size() > 2) {                      // size means if >2 different fruits
                    map.put(fruits[left], map.get(fruits[left]) - 1);
    
                    if(map.get(fruits[left]) == 0) {
                        map.remove(fruits[left]);
                    }
    
                    left++;
                }
    
                ans = Math.max(ans, right - left + 1);
            }
    
            return ans;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a string s and an integer k, replace at most k characters so that the resulting substring contains only one repeating character.
    
    EXAMPLE:
    Input: s = "ABAB", k = 2
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(26)`,
    
      bruteForceCode: `class Solution {
        public int characterReplacement(String s, int k) {
            int n = s.length();
            int ans = 0;
    
            for(int i = 0; i < n; i++) {
                int[] freq = new int[26];
                int maxFreq = 0;
    
                for(int j = i; j < n; j++) {
                    freq[s.charAt(j)-'A']++;        // means freq[any char]=1
                    maxFreq = Math.max(maxFreq,
                                       freq[s.charAt(j)-'A']);
    
                    int len = j - i + 1;
    
                    if(len - maxFreq <= k) {
                        ans = Math.max(ans, len);
                    }
                }
            }
    
            return ans;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(26)`,
    
      optimalCode: `class Solution {
        public int characterReplacement(String s, int k) {
            int[] freq = new int[26];
    
            int left = 0;
            int maxFreq = 0;
            int ans = 0;
    
            for(int right = 0; right < s.length(); right++) {
                freq[s.charAt(right)-'A']++;
    
                maxFreq = Math.max(maxFreq,
                                   freq[s.charAt(right)-'A']);
    
                while((right - left + 1) - maxFreq > k) {
                    freq[s.charAt(left)-'A']--;
                    left++;
                }
    
                ans = Math.max(ans, right - left + 1);
            }
    
            return ans;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a binary array nums and an integer goal, return the number of non-empty subarrays with sum = goal.
    
    EXAMPLE:
    Input: nums = [1,0,1,0,1], goal = 2
    Output: 4  =  [1,0,1],[1,0,1,0],[0,1,0,1],[1,0,1]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int numSubarraysWithSum(int[] nums, int goal) {
            int count = 0;
    
            for(int i = 0; i < nums.length; i++) {
                int sum = 0;
    
                for(int j = i; j < nums.length; j++) {
                    sum += nums[j];
    
                    if(sum == goal) count++;
                }
            }
    
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
    
        private int atMost(int[] nums, int goal) {
            if(goal < 0) return 0;
    
            int left = 0, sum = 0, count = 0;
    
            for(int right = 0; right < nums.length; right++) {
                sum += nums[right];
    
                while(sum > goal) {
                    sum -= nums[left++];
                }
    
                count += right - left + 1;
            }
    
            return count;
        }
    
        public int numSubarraysWithSum(int[] nums, int goal) {
            return atMost(nums, goal)
                 - atMost(nums, goal - 1);          // Exactly(2) = AtMost(2)-AtMost(1)  this logic is getting used
        }
    }`
    },



    {
      title: `QUESTION:
    Given an array nums and an integer k, return the number of subarrays with exactly k odd numbers.
    
    EXAMPLE:
    Input: nums = [1,1,2,1,1], k = 3
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int numberOfSubarrays(int[] nums, int k) {
            int count = 0;
    
            for(int i = 0; i < nums.length; i++) {
                int odd = 0;
    
                for(int j = i; j < nums.length; j++) {
                    if(nums[j] % 2 == 1) odd++;
    
                    if(odd == k) count++;
                }
            }
    
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
    
        private int atMost(int[] nums, int k) {
            int left = 0;
            int count = 0;
    
            for(int right = 0; right < nums.length; right++) {
                if(nums[right] % 2 == 1) k--;
    
                while(k < 0) {
                    if(nums[left] % 2 == 1) k++;
                    left++;
                }
    
                count += right - left + 1;
            }
    
            return count;
        }
    
        public int numberOfSubarrays(int[] nums, int k) {
            return atMost(nums, k)
                 - atMost(nums, k - 1);
        }
    }`
    },


    {
      title: `QUESTION:
    Given a string s consisting only of a, b and c.
    Return the number of substrings containing at least one occurrence of all three characters.
    
    EXAMPLE:
    Input: s = "abcabc"
    Output: 10`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int numberOfSubstrings(String s) {
            int count = 0;
    
            for(int i = 0; i < s.length(); i++) {
                int[] freq = new int[3];
    
                for(int j = i; j < s.length(); j++) {
                    freq[s.charAt(j)-'a']++;
    
                    if(freq[0] > 0 &&
                       freq[1] > 0 &&
                       freq[2] > 0) {
                        count++;
                    }
                }
            }
    
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int numberOfSubstrings(String s) {
            int[] last = {-1,-1,-1};
    
            int count = 0;
    
            for(int i = 0; i < s.length(); i++) {
                last[s.charAt(i)-'a'] = i;
    
                if(last[0] != -1 &&
                   last[1] != -1 &&
                   last[2] != -1) {
    
                    count += Math.min(last[0],
                             Math.min(last[1], last[2])) + 1;
                }
            }
    
            return count;
        }
    }`
    },



    {
      title: `QUESTION:
    There are several cards arranged in a row.
    You can take exactly k cards from the beginning or the end.
    
    EXAMPLE:
    Input: cardPoints = [1,2,3,4,5,6,1], k = 3
    Output: 12`,
    
      bruteForceComplexity: `Time Complexity: O(2^K)
    Space Complexity: O(K)`,
    
      bruteForceCode: `class Solution {
        int solve(int[] arr, int left, int right, int k) {
            if(k == 0) return 0;
    
            return Math.max(
                arr[left] + solve(arr,left+1,right,k-1),
                arr[right] + solve(arr,left,right-1,k-1)
            );
        }
    
        public int maxScore(int[] cardPoints, int k) {
            return solve(cardPoints,0,
                         cardPoints.length-1,k);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(K)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxScore(int[] cardPoints, int k) {
            int n = cardPoints.length;
    
            int leftSum = 0;
    
            for(int i = 0; i < k; i++) {
                leftSum += cardPoints[i];
            }
    
            int maxSum = leftSum;
            int rightSum = 0;
    
            for(int i = k - 1; i >= 0; i--) {
                leftSum -= cardPoints[i];
    
                rightSum += cardPoints[n - (k - i)];
    
                maxSum = Math.max(maxSum,
                                  leftSum + rightSum);
            }
    
            return maxSum;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a string s and an integer k, return the length of the longest substring that contains at most k distinct characters.
    
    EXAMPLE:
    Input: s = "eceba", k = 2
    Output: 3
    Explanation: "ece" contains only 2 distinct characters.`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(K)`,
    
      bruteForceCode: `class Solution {
        public int lengthOfLongestSubstringKDistinct(String s, int k) {
            int n = s.length();
            int ans = 0;
    
            for(int i = 0; i < n; i++) {
                HashMap<Character,Integer> map = new HashMap<>();
    
                for(int j = i; j < n; j++) {
                    char ch = s.charAt(j);
    
                    map.put(ch, map.getOrDefault(ch,0)+1);
    
                    if(map.size() > k) break;
    
                    ans = Math.max(ans, j - i + 1);
                }
            }
    
            return ans;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(K)`,
    
      optimalCode: `class Solution {
        public int lengthOfLongestSubstringKDistinct(String s, int k) {
            HashMap<Character,Integer> map = new HashMap<>();
    
            int left = 0;
            int ans = 0;
    
            for(int right = 0; right < s.length(); right++) {
                char ch = s.charAt(right);
    
                map.put(ch, map.getOrDefault(ch,0)+1);
    
                while(map.size() > k) {
                    char leftChar = s.charAt(left);
    
                    map.put(leftChar, map.get(leftChar)-1);
    
                    if(map.get(leftChar) == 0) {
                        map.remove(leftChar);
                    }
    
                    left++;
                }
    
                ans = Math.max(ans, right - left + 1);
            }
    
            return ans;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an integer array nums and an integer k, return the number of good subarrays.
    A good array is an array where the number of distinct integers is exactly k.
    
    EXAMPLE:
    Input: nums = [1,2,1,2,3], k = 2
    Output: 7 -> [1,2] [1,2,1] [1,2,1,2] [2,1] [2,1,2] [1,2] [2,3]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(K)`,
    
      bruteForceCode: `class Solution {
        public int subarraysWithKDistinct(int[] nums, int k) {
            int count = 0;
    
            for(int i = 0; i < nums.length; i++) {
                HashMap<Integer,Integer> map = new HashMap<>();
    
                for(int j = i; j < nums.length; j++) {
                    map.put(nums[j],
                            map.getOrDefault(nums[j],0)+1);
    
                    if(map.size() == k) count++;
    
                    if(map.size() > k) break;
                }
            }
    
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(K)`,
    
      optimalCode: `class Solution {
    
        private int atMost(int[] nums, int k) {
            HashMap<Integer,Integer> map = new HashMap<>();
    
            int left = 0;
            int count = 0;
    
            for(int right = 0; right < nums.length; right++) {
                map.put(nums[right],
                        map.getOrDefault(nums[right],0)+1);
    
                while(map.size() > k) {
                    map.put(nums[left],
                            map.get(nums[left]) - 1);
    
                    if(map.get(nums[left]) == 0) {
                        map.remove(nums[left]);
                    }
    
                    left++;
                }
    
                count += right - left + 1;
            }
    
            return count;
        }
    
        public int subarraysWithKDistinct(int[] nums, int k) {
            return atMost(nums, k)
                 - atMost(nums, k - 1);
        }
    }`
    },


    {
      title: `QUESTION:
    Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.
    
    EXAMPLE:
    Input: s = "ADOBECODEBANC"
           t = "ABC"
    
    Output: "BANC"`,
    
      bruteForceComplexity: `Time Complexity: O(N^3)
    Space Complexity: O(256)`,
    
      bruteForceCode: `class Solution {
        public String minWindow(String s, String t) {
            int minLen = Integer.MAX_VALUE;
            String ans = "";
    
            for(int i = 0; i < s.length(); i++) {
    
                for(int j = i; j < s.length(); j++) {
    
                    String sub = s.substring(i, j + 1);
    
                    if(isValid(sub, t)) {
    
                        if(sub.length() < minLen) {
                            minLen = sub.length();
                            ans = sub;
                        }
                    }
                }
            }
    
            return ans;
        }
    
        private boolean isValid(String sub, String t) {
            int[] freq = new int[256];
    
            for(char ch : sub.toCharArray()) {
                freq[ch]++;
            }
    
            for(char ch : t.toCharArray()) {
                if(freq[ch]-- <= 0) {
                    return false;
                }
            }
    
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(256)`,
    
      optimalCode: `
      class Solution {
          public String minWindow(String s, String t) {

              // Stores frequency of characters required from t
              int[] freq = new int[256];

              // Build frequency map of t
              for(char ch : t.toCharArray()) {
                  freq[ch]++;
              }

              // Left pointer of sliding window
              int left = 0;

              // Number of required characters still missing
              int count = t.length();

              // Stores minimum window length found
              int minLen = Integer.MAX_VALUE;

              // Stores starting index of minimum window
              int start = 0;

              // Expand window by moving right pointer
              for(int right = 0; right < s.length(); right++) {

                  // If current character is still needed
                  if(freq[s.charAt(right)] > 0) {
                      count--;            // One required character found
                  }

                  // Include current character in window
                  freq[s.charAt(right)]--;

                  // Window is valid (contains all required characters)
                  while(count == 0) {

                      // Update answer if current window is smaller
                      if(right - left + 1 < minLen) {
                          minLen = right - left + 1;
                          start = left;
                      }

                      // Remove left character from window
                      freq[s.charAt(left)]++;

                      // If removed character becomes required again
                      if(freq[s.charAt(left)] > 0) {
                          count++;        // Window becomes invalid
                      }

                      // Shrink window from left
                      left++;
                  }
              }

              // If no valid window found return ""
              // Otherwise return minimum window substring
              return minLen == Integer.MAX_VALUE
                    ? ""
                    : s.substring(start, start + minLen);   // if(2,2+3)-> (2,5) substring (excluding 5)
          }
      }`
    },


    {
      title: `QUESTION:
    Given strings s1 and s2, find the minimum contiguous substring of s1 such that s2 appears as a subsequence in it.
    
    EXAMPLE:
    Input:
    s1 = "abcdebdde"
    s2 = "bde"
    
    Output:
    "bcde"`,
    
      bruteForceComplexity: `Time Complexity: O(N^3)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
    
        public String minWindow(String s1, String s2) {
    
            int minLen = Integer.MAX_VALUE;
            String ans = "";
    
            for(int i = 0; i < s1.length(); i++) {
    
                for(int j = i; j < s1.length(); j++) {
    
                    String sub = s1.substring(i, j + 1);
    
                    if(isSubsequence(sub, s2)) {
    
                        if(sub.length() < minLen) {
                            minLen = sub.length();
                            ans = sub;
                        }
                    }
                }
            }
    
            return ans;
        }
    
        private boolean isSubsequence(String s, String t) {
    
            int i = 0, j = 0;
    
            while(i < s.length() && j < t.length()) {
                if(s.charAt(i) == t.charAt(j)) {
                    j++;
                }
                i++;
            }
    
            return j == t.length();            // j value == t.length()  then true
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
    
        public String minWindow(String s1, String s2) {
            int n = s1.length();
            int m = s2.length();
            int minLen = Integer.MAX_VALUE;
            int start = -1;
            int i = 0;
            while(i < n) {                 // for finding the shortest one
                int j = 0;
                while(i < n) {              // for finding forward one ex- abcde
                    if(s1.charAt(i) == s2.charAt(j)) {
                        j++;
                        if(j == m) break;
                    }
                    i++;
                }
                if(i == n) break;
                int end = i + 1;
                j = m - 1;
                while(i >= 0) {
                    if(s1.charAt(i) == s2.charAt(j)) {       // to shrink forward if unnecessary there abcde -> bcde  using backward
                        j--;
                        if(j < 0) break;
                    }
                    i--;
                }
                int windowLen = end - i;
                if(windowLen < minLen) {
                    minLen = windowLen;
                    start = i;
                }
                i++;
            }
            return start == -1 ? "": s1.substring(start, start + minLen);
        }
    }`
    },


    

  ],



  "graphs":[
    {
      title: `QUESTION:
    Given an n x n matrix isConnected where isConnected[i][j] = 1 if the ith city and the jth city are directly connected, return the total number of provinces.
    
    EXAMPLE:
    Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
    Output: 2`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int findCircleNum(int[][] isConnected) {
            int n = isConnected.length;
            boolean[] visited = new boolean[n];
            int provinces = 0;
            
            for (int i = 0; i < n; i++) {
                if (!visited[i]) {
                    provinces++;
                    dfs(isConnected, visited, i);
                }
            }
            return provinces;
        }
        
        private void dfs(int[][] isConnected, boolean[] visited, int node) {
            visited[node] = true;
            for (int i = 0; i < isConnected.length; i++) {
                if (isConnected[node][i] == 1 && !visited[i]) {
                    dfs(isConnected, visited, i);
                }
            }
        }
    }`
    },



    {
      title: `QUESTION:
    Given a 2D grid, count the number of connected components of 1's (4-directional connectivity).
    
    EXAMPLE:
    Input: grid = [[1,1,0],[0,1,0],[0,0,1]]
    Output: 2`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int connectedComponents(int[][] grid) {
            if (grid == null || grid.length == 0) return 0;
            int n = grid.length, m = grid[0].length;
            boolean[][] visited = new boolean[n][m];
            int count = 0;
            
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    if (grid[i][j] == 1 && !visited[i][j]) {
                        count++;
                        dfs(grid, visited, i, j);
                    }
                }
            }
            return count;
        }
        
        private void dfs(int[][] grid, boolean[][] visited, int i, int j) {
            if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || 
                grid[i][j] == 0 || visited[i][j]) return;
            
            visited[i][j] = true;
            dfs(grid, visited, i-1, j);
            dfs(grid, visited, i+1, j);
            dfs(grid, visited, i, j-1);
            dfs(grid, visited, i, j+1);
        }
    }`
    },


    {
      title: `QUESTION:
    You are given an m x n grid where each cell can have 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, any fresh orange adjacent (4 directions) to a rotten one becomes rotten. Return the minimum number of minutes until all oranges are rotten. If impossible, return -1.
    
    EXAMPLE:
    Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
    Output: 4`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `
      class Solution {
          public int orangesRotting(int[][] grid) {
              int n = grid.length;
              int m = grid[0].length;
              Queue<int[]> q = new LinkedList<>();
              int fresh = 0;

              // Add all rotten oranges and count fresh oranges
              for(int i=0;i<n;i++){
                  for(int j=0;j<m;j++){
                      if(grid[i][j]==2)
                          q.offer(new int[]{i,j,0}); // row, col, time
                      else if(grid[i][j]==1)
                          fresh++;
                  }
              }
              int minutes = 0;

              int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
              while(!q.isEmpty()){
                  int[] curr = q.poll();
                  int row = curr[0];
                  int col = curr[1];
                  int time = curr[2];
                  minutes = Math.max(minutes,time);

                  for(int[] dir : dirs){
                      int x = row + dir[0];
                      int y = col + dir[1];

                      if(x>=0 && x<n && y>=0 && y<m && grid[x][y]==1){
                          grid[x][y] = 2;
                          fresh--;
                          q.offer(new int[]{x,y,time+1});
                      }
                  }
              }
              return fresh==0 ? minutes : -1;
          }
      }`
    },


    {
      title: `QUESTION:
    You are given an image represented by a 2D grid of integers, a starting pixel (sr, sc), and a newColor. Perform a flood fill on the image starting from the starting pixel, replacing the color of all connected pixels (4-directionally) with the same color as the starting pixel with newColor.
    
    EXAMPLE:
    Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, newColor = 2
    Output: [[2,2,2],[2,2,0],[2,0,1]]`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int[][] floodFill(int[][] image, int sr, int sc, int newColor) {
            int oldColor = image[sr][sc];
            if (oldColor == newColor) return image;
            dfs(image, sr, sc, oldColor, newColor);
            return image;
        }
        
        private void dfs(int[][] image, int i, int j, int oldColor, int newColor) {
            if (i < 0 || i >= image.length || j < 0 || j >= image[0].length || image[i][j] != oldColor) return;
            
            image[i][j] = newColor;
            dfs(image, i-1, j, oldColor, newColor);
            dfs(image, i+1, j, oldColor, newColor);
            dfs(image, i, j-1, oldColor, newColor);
            dfs(image, i, j+1, oldColor, newColor);
        }
    }`
    },



    {
      title: `QUESTION:
    Given an undirected graph, detect if there is a cycle in the graph.
    
    EXAMPLE:
    Input: edges = [[0,1],[1,2],[2,0]]
    Output: true`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public boolean isCycle(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    if (bfsCycle(adj, i, visited)) return true;
                }
            }
            return false;
        }
        
        private boolean bfsCycle(ArrayList<ArrayList<Integer>> adj, int src, boolean[] visited) {
            Queue<int[]> q = new LinkedList<>();
            q.offer(new int[]{src, -1});
            visited[src] = true;
            
            while (!q.isEmpty()) {
                int[] curr = q.poll();
                int node = curr[0], parent = curr[1];
                
                for (int nei : adj.get(node)) {
                    if (!visited[nei]) {
                        visited[nei] = true;
                        q.offer(new int[]{nei, node});
                    } else if (nei != parent) {
                        return true;
                    }
                }
            }
            return false;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an undirected graph, detect if there is a cycle using DFS.
    
    EXAMPLE:
    Input: edges = [[0,1],[1,2],[2,0]]
    Output: true`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public boolean isCycle(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    if (dfsCycle(adj, i, -1, visited)) return true;
                }
            }
            return false;
        }
        
        private boolean dfsCycle(ArrayList<ArrayList<Integer>> adj, int node, int parent, boolean[] visited) {
            visited[node] = true;
            for (int nei : adj.get(node)) {
                if (!visited[nei]) {
                    if (dfsCycle(adj, nei, node, visited)) return true;
                } else if (nei != parent) {
                    return true;
                }
            }
            return false;
        }
    }`
    },


    {
      title: `QUESTION:
        Given a binary grid of N x M. Find the distance of the nearest 1 in the grid for each cell.
    
        EXAMPLE:
        Input: grid = [[0,1,1,0],[1,1,0,0],[0,0,1,1]]
        Output: [[1,0,0,1],[0,0,1,1],[1,1,0,0]]`,
    
      optimalComplexity: `Time Complexity: O(N * M)
        Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int[][] nearest(int[][] grid) {
            int n = grid.length;
            int m = grid[0].length;
            int[][] dist = new int[n][m];
            boolean[][] vis = new boolean[n][m];
    
            Queue<int[]> q = new LinkedList<>();
    
            // Push all 1's into queue
            for(int i=0;i<n;i++){
                for(int j=0;j<m;j++){
    
                    if(grid[i][j]==1){
                        q.offer(new int[]{i,j,0});
                        vis[i][j] = true;
                    }
                }
            }
    
            int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    
            while(!q.isEmpty()){
                int[] curr = q.poll();
                int row = curr[0];
                int col = curr[1];
                int steps = curr[2];
    
                dist[row][col] = steps;
                for(int[] dir : dirs){
                    int x = row + dir[0];
                    int y = col + dir[1];
                    if(x>=0 && x<n && y>=0 && y<m && !vis[x][y]){
                        vis[x][y] = true;
                        q.offer(new int[]{x,y,steps+1});
                    }
                }
            }
    
            return dist;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a 2D board containing 'X' and 'O', capture all regions surrounded by 'X' by flipping 'O's into 'X's. A region is captured if it is surrounded on all sides by 'X'.
    
    EXAMPLE:
    Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
    Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public void solve(char[][] board) {
            if (board.length == 0) return;
            int n = board.length, m = board[0].length;
            
            for (int i = 0; i < n; i++) {
                if (board[i][0] == 'O') dfs(board, i, 0);
                if (board[i][m-1] == 'O') dfs(board, i, m-1);
            }
            for (int j = 0; j < m; j++) {
                if (board[0][j] == 'O') dfs(board, 0, j);
                if (board[n-1][j] == 'O') dfs(board, n-1, j);
            }
            
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    if (board[i][j] == 'O') board[i][j] = 'X';
                    else if (board[i][j] == '#') board[i][j] = 'O';
                }
            }
        }
        
        private void dfs(char[][] board, int i, int j) {
            if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != 'O') return;
            board[i][j] = '#';
            dfs(board, i-1, j);
            dfs(board, i+1, j);
            dfs(board, i, j-1);
            dfs(board, i, j+1);
        }
    }`
    },


    {
      title: `QUESTION:
    Given an m x n binary matrix grid, return the number of land cells (1s) that cannot walk off the boundary of the grid in any number of moves (4 directions).
    
    EXAMPLE:
    Input: grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]
    Output: 3`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int numEnclaves(int[][] grid) {
            int n = grid.length, m = grid[0].length;
            for (int i = 0; i < n; i++) {
                if (grid[i][0] == 1) dfs(grid, i, 0);
                if (grid[i][m-1] == 1) dfs(grid, i, m-1);
            }
            for (int j = 0; j < m; j++) {
                if (grid[0][j] == 1) dfs(grid, 0, j);
                if (grid[n-1][j] == 1) dfs(grid, n-1, j);
            }
            
            int count = 0;
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    if (grid[i][j] == 1) count++;
                }
            }
            return count;
        }
        
        private void dfs(int[][] grid, int i, int j) {
            if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == 0) return;
            grid[i][j] = 0;
            dfs(grid, i-1, j);
            dfs(grid, i+1, j);
            dfs(grid, i, j-1);
            dfs(grid, i, j+1);
        }
    }`
    },


    {
      title: `QUESTION:
    A transformation sequence from word beginWord to endWord using a dictionary wordList is a sequence where only one letter is changed at a time and each transformed word must exist in the word list. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.
    
    EXAMPLE:
    Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
    Output: 5`,


    bruteForceCode:`
    class Pair {
    String word;
    int level;

    Pair(String word, int level) {
        this.word = word;
        this.level = level;
    }
}

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {

        Set<String> wordSet = new HashSet<>(wordList);

        if (!wordSet.contains(endWord))
            return 0;

        Queue<Pair> q = new LinkedList<>();
        q.offer(new Pair(beginWord, 1));

        Set<String> visited = new HashSet<>();
        visited.add(beginWord);

        while (!q.isEmpty()) {

            Pair curr = q.poll();

            if (curr.word.equals(endWord))
                return curr.level;

            char[] chars = curr.word.toCharArray();

            for (int i = 0; i < chars.length; i++) {

                char original = chars[i];

                for (char c = 'a'; c <= 'z'; c++) {

                    chars[i] = c;

                    String next = new String(chars);

                    if (wordSet.contains(next) && !visited.contains(next)) {
                        visited.add(next);
                        q.offer(new Pair(next, curr.level + 1));
                    }
                }

                chars[i] = original;
            }
        }

        return 0;
    }
}`,
    
      optimalComplexity: `Time Complexity: O(N * L²) where L is word length
    Space Complexity: O(N)`,
    
      optimalCode: `
      class Solution {
          public int ladderLength(String beginWord, String endWord, List<String> wordList) {
              Set<String> wordSet = new HashSet<>(wordList);
              if(!wordSet.contains(endWord))
                  return 0;
              Queue<Object[]> q = new LinkedList<>();
              q.offer(new Object[]{beginWord, 1});
              Set<String> visited = new HashSet<>();
              visited.add(beginWord);

              while(!q.isEmpty()){
                  Object[] curr = q.poll();
                  String word = (String) curr[0];
                  int level = (int) curr[1];

                  if(word.equals(endWord))
                      return level;

                  char[] chars = word.toCharArray();
                  for(int i=0;i<chars.length;i++){
                      char original = chars[i];
                      for(char c='a'; c<='z'; c++){
                          chars[i] = c;
                          String next = new String(chars);
                          if(wordSet.contains(next) && !visited.contains(next)){

                              visited.add(next);
                              q.offer(new Object[]{next, level + 1});
                          }
                      }

                      chars[i] = original;
                  }
              }

              return 0;
          }
      }`
    },


    {
      title: `QUESTION:
    A transformation sequence from word beginWord to endWord using a dictionary wordList is a sequence of words where:
    - The first word is beginWord.
    - The last word is endWord.
    - Every adjacent pair differs by exactly one letter.
    - Every word in the sequence is in wordList.
    Return all the shortest transformation sequences from beginWord to endWord. Return empty list if no such sequence exists.
    
    EXAMPLE:
    Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
    Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]`,
    
      optimalComplexity: `Time Complexity: O(N * L²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
            Set<String> wordSet = new HashSet<>(wordList);
            if (!wordSet.contains(endWord)) return new ArrayList<>();
            
            Map<String, List<String>> graph = new HashMap<>();
            Map<String, Integer> distance = new HashMap<>();
            
            // BFS to build graph and distances
            Queue<String> queue = new LinkedList<>();
            queue.offer(beginWord);
            distance.put(beginWord, 0);
            
            while (!queue.isEmpty()) {
                String curr = queue.poll();
                if (curr.equals(endWord)) break;
                
                char[] chars = curr.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[i] = c;
                        String next = new String(chars);
                        if (wordSet.contains(next)) {
                            if (!distance.containsKey(next)) {
                                distance.put(next, distance.get(curr) + 1);
                                queue.offer(next);
                                graph.putIfAbsent(curr, new ArrayList<>());
                                graph.get(curr).add(next);
                            } else if (distance.get(next) == distance.get(curr) + 1) {
                                graph.putIfAbsent(curr, new ArrayList<>());
                                graph.get(curr).add(next);
                            }
                        }
                    }
                    chars[i] = original;
                }
            }
            
            List<List<String>> result = new ArrayList<>();
            List<String> path = new ArrayList<>();
            path.add(beginWord);
            
            // DFS to find all shortest paths
            dfs(beginWord, endWord, graph, distance, path, result);
            return result;
        }
        
        private void dfs(String curr, String endWord, Map<String, List<String>> graph, 
                         Map<String, Integer> distance, List<String> path, List<List<String>> result) {
            if (curr.equals(endWord)) {
                result.add(new ArrayList<>(path));
                return;
            }
            
            if (!graph.containsKey(curr)) return;
            
            for (String next : graph.get(curr)) {
                path.add(next);
                dfs(next, endWord, graph, distance, path, result);
                path.remove(path.size() - 1);
            }
        }
    }`
    },


    {
      title: `QUESTION:
    Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.
    
    EXAMPLE:
    Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
    Output: 1`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int numIslands(char[][] grid) {
            if (grid == null || grid.length == 0) return 0;
            int n = grid.length, m = grid[0].length;
            int count = 0;
            
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    if (grid[i][j] == '1') {
                        count++;
                        dfs(grid, i, j);
                    }
                }
            }
            return count;
        }
        
        private void dfs(char[][] grid, int i, int j) {
            if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] != '1') return;
            grid[i][j] = '0';
            dfs(grid, i-1, j);
            dfs(grid, i+1, j);
            dfs(grid, i, j-1);
            dfs(grid, i, j+1);
        }
    }`
    },


    {
      title: `QUESTION:
    Given an adjacency list of a graph, return true if the graph is bipartite.
    
    EXAMPLE:
    Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
    Output: false`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public boolean isBipartite(int[][] graph) {
            int n = graph.length;
            int[] color = new int[n];
            Arrays.fill(color, -1);
            
            for (int i = 0; i < n; i++) {
                if (color[i] == -1) {
                    if (!dfs(graph, i, 0, color)) return false;
                }
            }
            return true;
        }
        
        private boolean dfs(int[][] graph, int node, int col, int[] color) {
            color[node] = col;
            for (int nei : graph[node]) {
                if (color[nei] == -1) {
                    if (!dfs(graph, nei, 1 - col, color)) return false;
                } else if (color[nei] == col) {
                    return false;
                }
            }
            return true;
        }
    }`
    },

    {
      title: `QUESTION:
    Given a directed graph, detect if there is a cycle using DFS.
    
    EXAMPLE:
    Input: graph with cycle
    Output: true`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public boolean isCyclic(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            boolean[] recStack = new boolean[V];
            
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    if (dfsCycle(adj, i, visited, recStack)) return true;
                }
            }
            return false;
        }
        
        private boolean dfsCycle(ArrayList<ArrayList<Integer>> adj, int node, boolean[] visited, boolean[] recStack) {
            visited[node] = true;
            recStack[node] = true;
            
            for (int nei : adj.get(node)) {
                if (!visited[nei]) {
                    if (dfsCycle(adj, nei, visited, recStack)) return true;
                } else if (recStack[nei]) {
                    return true;
                }
            }
            recStack[node] = false;
            return false;
        }
    }`
    },

    {
      title: `QUESTION:     (NEW PATTERN)
    Given a Directed Acyclic Graph (DAG) with V vertices and E edges, return any valid topological ordering of its vertices. If the graph contains a cycle, topological sort is not possible.
    
    EXAMPLE:
    Input: V = 6, edges = [[5,0],[5,2],[2,3],[3,1],[4,0],[4,1]]
    Output: [5,4,2,3,1,0]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int[] topoSort(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            Stack<Integer> stack = new Stack<>();
            
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    dfs(adj, i, visited, stack);
                }
            }
            
            int[] topo = new int[V];
            int idx = 0;
            while (!stack.isEmpty()) {
                topo[idx++] = stack.pop();
            }
            return topo;
        }
        
        private void dfs(ArrayList<ArrayList<Integer>> adj, int node, boolean[] visited, Stack<Integer> stack) {
            visited[node] = true;
            for (int nei : adj.get(node)) {
                if (!visited[nei]) {
                    dfs(adj, nei, visited, stack);
                }
            }
            stack.push(node);
        }
    }`
    },


    {
      title: `QUESTION:
    Given a Directed Acyclic Graph (DAG), perform topological sort using Kahn's algorithm (BFS + Indegree).
    
    EXAMPLE:
    Input: V = 6, edges = [[5,0],[5,2],[2,3],[3,1],[4,0],[4,1]]
    Output: [4,5,2,0,3,1]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int[] topoSort(int V, ArrayList<ArrayList<Integer>> adj) {
            int[] indegree = new int[V];
            for (int i = 0; i < V; i++) {
                for (int nei : adj.get(i)) {
                    indegree[nei]++;
                }
            }
            
            Queue<Integer> q = new LinkedList<>();
            for (int i = 0; i < V; i++) {
                if (indegree[i] == 0) q.offer(i);
            }
            
            int[] topo = new int[V];
            int idx = 0;
            
            while (!q.isEmpty()) {
                int node = q.poll();
                topo[idx++] = node;
                
                for (int nei : adj.get(node)) {
                    indegree[nei]--;
                    if (indegree[nei] == 0) q.offer(nei);
                }
            }
            
            // If idx != V, cycle exists
            return idx == V ? topo : new int[0];
        }
    }`
    },



    {
      title: `QUESTION:
    Given a directed graph, return true if it contains a cycle, else false.
    
    EXAMPLE:
    Input: Graph with cycle (e.g., 0->1->2->0)
    Output: true`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public boolean isCyclic(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            boolean[] recStack = new boolean[V];
            
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    if (dfsCycle(adj, i, visited, recStack)) return true;
                }
            }
            return false;
        }
        
        private boolean dfsCycle(ArrayList<ArrayList<Integer>> adj, int node, 
                                 boolean[] visited, boolean[] recStack) {
            visited[node] = true;
            recStack[node] = true;
            
            for (int nei : adj.get(node)) {
                if (!visited[nei]) {
                    if (dfsCycle(adj, nei, visited, recStack)) return true;
                } else if (recStack[nei]) {
                    return true;
                }
            }
            recStack[node] = false;
            return false;
        }
    }`
    },



    {
      title: `QUESTION:
    There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi before course ai. Return true if you can finish all courses.
    
    EXAMPLE:
    Input: numCourses = 2, prerequisites = [[1,0]]
    Output: true`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public boolean canFinish(int numCourses, int[][] prerequisites) {
            ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
            for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
            
            for (int[] pre : prerequisites) {
                adj.get(pre[1]).add(pre[0]);
            }
            
            return !isCyclic(numCourses, adj);         // if no cycle then all courses can be finished 
        }
        
        private boolean isCyclic(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            boolean[] recStack = new boolean[V];
            for (int i = 0; i < V; i++) {
                if (!visited[i] && dfsCycle(adj, i, visited, recStack)) return true;
            }
            return false;
        }
        
        private boolean dfsCycle(ArrayList<ArrayList<Integer>> adj, int node, 
                                 boolean[] visited, boolean[] recStack) {
            visited[node] = true;
            recStack[node] = true;
            for (int nei : adj.get(node)) {
                if (!visited[nei]) {
                    if (dfsCycle(adj, nei, visited, recStack)) return true;
                } else if (recStack[nei]) return true;
            }
            recStack[node] = false;
            return false;
        }
    }`
    },


    {
      title: `QUESTION:
    Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible, return an empty array.
    
    EXAMPLE:
    Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
    Output: [0,2,1,3]`,

    bruteForceCode:`
    class Solution {
        public int[] findOrder(int numCourses, int[][] prerequisites) {
            ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
            for(int i=0;i<numCourses;i++)
                adj.add(new ArrayList<>());

            for(int[] pre : prerequisites)
                adj.get(pre[1]).add(pre[0]);

            boolean[] visited = new boolean[numCourses];
            boolean[] recStack = new boolean[numCourses];
            Stack<Integer> st = new Stack<>();
            for(int i=0;i<numCourses;i++){
                if(!visited[i]){
                    if(dfs(i,adj,visited,recStack,st))
                        return new int[0]; // cycle found
                }
            }
            int[] ans = new int[numCourses];
            int idx = 0;
            while(!st.isEmpty())
                ans[idx++] = st.pop();
            return ans;
        }

        private boolean dfs(int node, ArrayList<ArrayList<Integer>> adj, boolean[] visited, boolean[] recStack, Stack<Integer> st){
            visited[node] = true;
            recStack[node] = true;
            for(int nei : adj.get(node)){
                if(!visited[nei]){
                    if(dfs(nei,adj,visited,recStack,st))
                        return true;
                }
                else if(recStack[nei]){
                    return true;
                }
            }
            recStack[node] = false;
            st.push(node); // Topological Sort step
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int[] findOrder(int numCourses, int[][] prerequisites) {
            ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
            int[] indegree = new int[numCourses];
            
            for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
            
            for (int[] pre : prerequisites) {
                adj.get(pre[1]).add(pre[0]);
                indegree[pre[0]]++;
            }
            
            Queue<Integer> q = new LinkedList<>();
            for (int i = 0; i < numCourses; i++) {
                if (indegree[i] == 0) q.offer(i);
            }
            
            int[] order = new int[numCourses];
            int idx = 0;
            
            while (!q.isEmpty()) {
                int node = q.poll();
                order[idx++] = node;
                
                for (int nei : adj.get(node)) {
                    indegree[nei]--;
                    if (indegree[nei] == 0) q.offer(nei);
                }
            }
            
            return idx == numCourses ? order : new int[0];     // return empty array
        }
    }`
    },



    {
      title: `QUESTION:
    Return an array containing all the safe nodes of the graph in ascending order. A node is a safe node if every possible path starting from that node leads to a terminal node (a node with no outgoing edges).
    
    EXAMPLE:
    Input: graph = [[1,2],[2,3],[5],[0],[5],[],[]]
    Output: [2,4,5,6]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public List<Integer> eventualSafeNodes(int[][] graph) {
            int n = graph.length;
            boolean[] visited = new boolean[n];
            boolean[] pathVis = new boolean[n];
            boolean[] safe = new boolean[n];
            
            for (int i = 0; i < n; i++) {
                if (!visited[i]) {
                    dfs(graph, i, visited, pathVis, safe);
                }
            }
            
            List<Integer> result = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if (safe[i]) result.add(i);
            }
            return result;
        }
        
        private boolean dfs(int[][] graph, int node, boolean[] visited, boolean[] pathVis, boolean[] safe) {
            visited[node] = true;
            pathVis[node] = true;
            
            for (int nei : graph[node]) {
                if (!visited[nei]) {
                    if (dfs(graph, nei, visited, pathVis, safe)) return true;
                } else if (pathVis[nei]) {
                    return true;
                }
            }
            
            pathVis[node] = false;
            safe[node] = true;
            return false;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a sorted dictionary (array of words) of an alien language, find the order of characters in the language.
    
    EXAMPLE:
    Input: words = ["baa", "abcd", "abca", "cab", "cad"]
    Output: "bdac"`,
    
      optimalComplexity: `Time Complexity: O(N * L + K) where K is number of unique characters
    Space Complexity: O(K)`,
    
      optimalCode: `class Solution {
        public String alienOrder(String[] words) {
            Map<Character, List<Character>> graph = new HashMap<>();
            Map<Character, Integer> indegree = new HashMap<>();
            
            // Initialize
            for (String word : words) {
                for (char c : word.toCharArray()) {
                    graph.putIfAbsent(c, new ArrayList<>());
                    indegree.putIfAbsent(c, 0);
                }
            }
            
            // Build graph
            for (int i = 0; i < words.length - 1; i++) {
                String w1 = words[i], w2 = words[i+1];
                int len = Math.min(w1.length(), w2.length());
                boolean foundDiff = false;
                for (int j = 0; j < len; j++) {
                    if (w1.charAt(j) != w2.charAt(j)) {
                        graph.get(w1.charAt(j)).add(w2.charAt(j));
                        indegree.put(w2.charAt(j), indegree.get(w2.charAt(j)) + 1);
                        foundDiff = true;
                        break;
                    }
                }
                if (!foundDiff && w1.length() > w2.length()) return ""; // Invalid
            }
            
            // Kahn's Algorithm
            Queue<Character> q = new LinkedList<>();
            for (char c : indegree.keySet()) {
                if (indegree.get(c) == 0) q.offer(c);
            }
            
            StringBuilder sb = new StringBuilder();
            while (!q.isEmpty()) {
                char c = q.poll();
                sb.append(c);
                for (char nei : graph.get(c)) {
                    indegree.put(nei, indegree.get(nei) - 1);
                    if (indegree.get(nei) == 0) q.offer(nei);
                }
            }
            
            return sb.length() == indegree.size() ? sb.toString() : "";
        }
    }`
    },


    {
      title: `QUESTION:    (NEW PATTERN)
    Given an undirected graph with unit weights (all edges have weight 1) and a source vertex, find the shortest distance from source to all other vertices.
    
    EXAMPLE:
    Input: edges = [[0,1],[0,2],[1,3],[2,3]], source = 0
    Output: [0,1,1,2]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int[] shortestPath(int[][] edges, int n, int m, int src) {
            ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
            for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
            
            for (int[] edge : edges) {
                adj.get(edge[0]).add(edge[1]);
                adj.get(edge[1]).add(edge[0]);
            }
            
            int[] dist = new int[n];
            Arrays.fill(dist, -1);
            Queue<Integer> q = new LinkedList<>();
            q.offer(src);
            dist[src] = 0;
            
            while (!q.isEmpty()) {
                int node = q.poll();
                for (int nei : adj.get(node)) {
                    if (dist[nei] == -1) {
                        dist[nei] = dist[node] + 1;
                        q.offer(nei);
                    }
                }
            }
            return dist;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a Directed Acyclic Graph (DAG) with weighted edges, find the shortest path from source to all other nodes.
    
    EXAMPLE:
    Input: N = 6, edges = [[0,1,2],[0,4,1],[1,2,3],[4,2,2],[4,5,4],[5,3,1]]
    Output: [0,2,4,6,1,5]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int[] shortestPath(int N, int M, int[][] edges) {
            ArrayList<ArrayList<int[]>> adj = new ArrayList<>();
            for (int i = 0; i < N; i++) adj.add(new ArrayList<>());
            
            for (int[] edge : edges) {
                adj.get(edge[0]).add(new int[]{edge[1], edge[2]});
            }
            
            int[] dist = new int[N];
            Arrays.fill(dist, Integer.MAX_VALUE);
            dist[0] = 0;
            
            Stack<Integer> topo = new Stack<>();
            boolean[] visited = new boolean[N];
            for (int i = 0; i < N; i++) {
                if (!visited[i]) dfs(adj, i, visited, topo);
            }
            
            while (!topo.isEmpty()) {
                int node = topo.pop();
                if (dist[node] != Integer.MAX_VALUE) {
                    for (int[] nei : adj.get(node)) {
                        if (dist[node] + nei[1] < dist[nei[0]]) {
                            dist[nei[0]] = dist[node] + nei[1];
                        }
                    }
                }
            }
            for (int i = 0; i < N; i++) {
                if (dist[i] == Integer.MAX_VALUE) dist[i] = -1;
            }
            return dist;
        }
        
        private void dfs(ArrayList<ArrayList<int[]>> adj, int node, boolean[] visited, Stack<Integer> topo) {
            visited[node] = true;
            for (int[] nei : adj.get(node)) {
                if (!visited[nei[0]]) dfs(adj, nei[0], visited, topo);
            }
            topo.push(node);
        }
    }`
    },


    {
      title: `QUESTION:
    Given a weighted undirected graph and a source vertex, find the shortest distance from source to all other vertices using Dijkstra's Algorithm.
    
    EXAMPLE:
    Input: N = 4, edges = [[0,1,1],[0,2,3],[1,3,4],[2,3,2]], source = 0
    Output: [0,1,3,5]`,
    
      optimalComplexity: `Time Complexity: O((V + E) log V)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int[] dijkstra(int V, ArrayList<ArrayList<int[]>> adj, int src) {
            int[] dist = new int[V];
            Arrays.fill(dist, Integer.MAX_VALUE);
            dist[src] = 0;
            
            PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
            pq.offer(new int[]{src, 0});
            
            while (!pq.isEmpty()) {
                int[] curr = pq.poll();
                int node = curr[0], distance = curr[1];
                
                if (distance > dist[node]) continue;
                
                for (int[] nei : adj.get(node)) {
                    int next = nei[0], weight = nei[1];
                    if (dist[node] + weight < dist[next]) {
                        dist[next] = dist[node] + weight;
                        pq.offer(new int[]{next, dist[next]});
                    }
                }
            }
            return dist;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an n x m binary matrix grid where 0 represents empty cell and 1 represents wall, find the shortest path from source to destination. You can move in 4 directions.
    
    EXAMPLE:
    Input: grid = [[0,1,1],[1,0,1],[1,0,0]], source = {0,0}, destination = {2,2}
    Output: 4`,
    
      optimalComplexity: `Time Complexity: O(N * M)
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int shortestPath(int[][] grid, int[] source, int[] destination) {
            int n = grid.length, m = grid[0].length;
            if (grid[source[0]][source[1]] == 1) return -1;
            
            int[][] dist = new int[n][m];
            for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
            dist[source[0]][source[1]] = 0;
            
            Queue<int[]> q = new LinkedList<>();
            q.offer(source);
            
            int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
            
            while (!q.isEmpty()) {
                int[] curr = q.poll();
                int x = curr[0], y = curr[1];
                
                if (x == destination[0] && y == destination[1]) return dist[x][y];
                
                for (int[] d : dirs) {
                    int nx = x + d[0], ny = y + d[1];
                    if (nx >= 0 && nx < n && ny >= 0 && ny < m && grid[nx][ny] == 0 && 
                        dist[x][y] + 1 < dist[nx][ny]) {
                        dist[nx][ny] = dist[x][y] + 1;
                        q.offer(new int[]{nx, ny});
                    }
                }
            }
            return -1;
        }
    }`
    },

    {
      title: `QUESTION:
    You are given a 2D grid heights. Find a path from top-left to bottom-right with minimum effort. Effort of a path is the maximum absolute difference in heights between two consecutive cells.
    
    EXAMPLE:
    Input: heights = [[1,2,2],[3,8,2],[5,3,5]]
    Output: 2`,
    
      optimalComplexity: `Time Complexity: O(N * M * log(MaxDiff))
    Space Complexity: O(N * M)`,
    
      optimalCode: `class Solution {
        public int minimumEffortPath(int[][] heights) {
            int n = heights.length, m = heights[0].length;
            int low = 0, high = 1000000;
            
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (canReach(heights, mid)) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
            return low;
        }
        
        private boolean canReach(int[][] heights, int maxEffort) {
            int n = heights.length, m = heights[0].length;
            boolean[][] visited = new boolean[n][m];
            Queue<int[]> q = new LinkedList<>();
            q.offer(new int[]{0, 0});
            visited[0][0] = true;
            
            int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
            
            while (!q.isEmpty()) {
                int[] curr = q.poll();
                if (curr[0] == n-1 && curr[1] == m-1) return true;
                
                for (int[] d : dirs) {
                    int x = curr[0] + d[0], y = curr[1] + d[1];
                    if (x >= 0 && x < n && y >= 0 && y < m && !visited[x][y]) {
                        if (Math.abs(heights[x][y] - heights[curr[0]][curr[1]]) <= maxEffort) {
                            visited[x][y] = true;
                            q.offer(new int[]{x, y});
                        }
                    }
                }
            }
            return false;
        }
    }`
    },


    {
      title: `QUESTION:
    Find the cheapest price from src to dst with at most k stops.
    
    EXAMPLE:
    Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
    Output: 700`,
    
      optimalComplexity: `Time Complexity: O(E * K)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
            ArrayList<ArrayList<int[]>> adj = new ArrayList<>();
            for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
            
            for (int[] f : flights) {
                adj.get(f[0]).add(new int[]{f[1], f[2]});
            }
            
            int[] dist = new int[n];
            Arrays.fill(dist, Integer.MAX_VALUE);
            dist[src] = 0;
            
            Queue<int[]> q = new LinkedList<>();
            q.offer(new int[]{src, 0, 0}); // node, cost, stops
            
            while (!q.isEmpty()) {
                int[] curr = q.poll();
                int node = curr[0], cost = curr[1], stops = curr[2];
                
                if (stops > k) continue;
                
                for (int[] nei : adj.get(node)) {
                    int next = nei[0], price = nei[1];
                    if (cost + price < dist[next]) {
                        dist[next] = cost + price;
                        q.offer(new int[]{next, dist[next], stops + 1});
                    }
                }
            }
            return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
        }
    }`
    },




    {
      title: `QUESTION:
    You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = [ui, vi, wi], where wi is the time it takes for a signal to travel from node ui to node vi. Return the time it takes for all nodes to receive the signal from node k. If impossible, return -1.
    
    EXAMPLE:
    Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
    Output: 2`,
    
      optimalComplexity: `Time Complexity: O((V + E) log V)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int networkDelayTime(int[][] times, int n, int k) {
            ArrayList<ArrayList<int[]>> adj = new ArrayList<>();
            for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
            
            for (int[] t : times) {
                adj.get(t[0]).add(new int[]{t[1], t[2]});
            }
            
            int[] dist = new int[n+1];
            Arrays.fill(dist, Integer.MAX_VALUE);
            dist[k] = 0;
            
            PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[1] - b[1]);
            pq.offer(new int[]{k, 0});
            
            while (!pq.isEmpty()) {
                int[] curr = pq.poll();
                int node = curr[0], time = curr[1];
                
                if (time > dist[node]) continue;
                
                for (int[] nei : adj.get(node)) {
                    if (dist[node] + nei[1] < dist[nei[0]]) {
                        dist[nei[0]] = dist[node] + nei[1];
                        pq.offer(new int[]{nei[0], dist[nei[0]]});
                    }
                }
            }
            
            int maxTime = 0;
            for (int i = 1; i <= n; i++) {
                if (dist[i] == Integer.MAX_VALUE) return -1;
                maxTime = Math.max(maxTime, dist[i]);
            }
            return maxTime;
        }
    }`
    },


    {
      title: `QUESTION:
    Return the number of ways to arrive at destination (0 to n-1) with the shortest time. Return answer modulo 10^9 + 7.
    
    EXAMPLE:
    Input: n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]
    Output: 4`,
    
      optimalComplexity: `Time Complexity: O((V + E) log V)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int countPaths(int n, int[][] roads) {
            int MOD = 1000000007;
            ArrayList<ArrayList<long[]>> adj = new ArrayList<>();
            for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
            
            for (int[] r : roads) {
                adj.get(r[0]).add(new long[]{r[1], r[2]});
                adj.get(r[1]).add(new long[]{r[0], r[2]});
            }
            
            long[] dist = new long[n];
            Arrays.fill(dist, Long.MAX_VALUE);
            dist[0] = 0;
            
            long[] ways = new long[n];
            ways[0] = 1;
            
            PriorityQueue<long[]> pq = new PriorityQueue<>((a,b) -> Long.compare(a[1], b[1]));
            pq.offer(new long[]{0, 0});
            
            while (!pq.isEmpty()) {
                long[] curr = pq.poll();
                long node = curr[0], d = curr[1];
                
                if (d > dist[(int)node]) continue;
                
                for (long[] nei : adj.get((int)node)) {
                    long next = nei[0], weight = nei[1];
                    if (dist[(int)node] + weight < dist[(int)next]) {
                        dist[(int)next] = dist[(int)node] + weight;
                        ways[(int)next] = ways[(int)node];
                        pq.offer(new long[]{next, dist[(int)next]});
                    } else if (dist[(int)node] + weight == dist[(int)next]) {
                        ways[(int)next] = (ways[(int)next] + ways[(int)node]) % MOD;
                    }
                }
            }
            return (int)ways[n-1];
        }
    }`
    },



    {
      title: `QUESTION:
    Given an array arr[] of integers and two integers start and end. You can multiply start with any element of arr and take modulo 100000. Find the minimum number of multiplications to reach end.
    
    EXAMPLE:
    Input: arr = [2,3,5], start = 3, end = 30
    Output: 2`,
    
      optimalComplexity: `Time Complexity: O(100000 * N)
    Space Complexity: O(100000)`,
    
      optimalCode: `class Solution {
        public int minimumMultiplications(int[] arr, int start, int end) {
            if (start == end) return 0;
            int MOD = 100000;
            int[] dist = new int[MOD];
            Arrays.fill(dist, -1);
            Queue<Integer> q = new LinkedList<>();
            q.offer(start);
            dist[start] = 0;
            
            while (!q.isEmpty()) {
                int curr = q.poll();
                for (int num : arr) {
                    int next = (curr * num) % MOD;
                    if (dist[next] == -1) {
                        dist[next] = dist[curr] + 1;
                        if (next == end) return dist[next];
                        q.offer(next);
                    }
                }
            }
            return -1;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a graph with negative weights, find the shortest path from source to all vertices using Bellman Ford Algorithm. Detect negative weight cycle if present.
    
    EXAMPLE:  Input : V = 6, Edges = [[3, 2, 6], [5, 3, 1], [0, 1, 5], [1, 5, -3], [1, 2, -2], [3, 4, -2], [2, 4, 3]], S = 0
    Output: 0 5 3 3 1 2`,
    
      optimalComplexity: `Time Complexity: O(V * E)
    Space Complexity: O(V)`,
    
      optimalCode: `class Solution {
        public int[] bellmanFord(int V, int[][] edges, int src) {
            int[] dist = new int[V];
            Arrays.fill(dist, 100000000);
            dist[src] = 0;
            
            for (int i = 0; i < V - 1; i++) {
                for (int[] edge : edges) {
                    int u = edge[0], v = edge[1], wt = edge[2];
                    if (dist[u] != 100000000 && dist[u] + wt < dist[v]) {
                        dist[v] = dist[u] + wt;
                    }
                }
            }
            
            // Check for negative cycle
            for (int[] edge : edges) {
                int u = edge[0], v = edge[1], wt = edge[2];
                if (dist[u] != 100000000 && dist[u] + wt < dist[v]) {
                    return new int[]{-1};
                }
            }
            return dist;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a graph of V vertices numbered from 0 to V-1. Find the shortest distances between every pair of vertices in a given edge-weighted directed graph. The graph is represented as an adjacency matrix of size n x n. Matrix[i][j] denotes the weight of the edge from i to j. If matrix[i][j]=-1, it means there is no edge from i to j.    
    EXAMPLE:  Input: matrix = [[0, 2, -1, -1],[1, 0, 3, -1],[-1, -1, 0, 1],[3, 5, 4, 0]]
    Output: [[0, 2, 5, 6], [1, 0, 3, 4], [4, 6, 0, 1], [3, 5, 4, 0]] 
    Explanation: matrix[0][0] is storing the distance from vertex 0 to vertex 0, the distance from vertex 0 to vertex 1 is 2 and so on.`,
    
      optimalComplexity: `Time Complexity: O(V³)
    Space Complexity: O(V²)`,
    
      optimalCode: `class Solution {
        public int[][] floydWarshall(int[][] matrix) {
            int n = matrix.length;
            int[][] dist = new int[n][n];
            
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = matrix[i][j];
                }
            }
            
            for (int k = 0; k < n; k++) {
                for (int i = 0; i < n; i++) {
                    for (int j = 0; j < n; j++) {
                        if (dist[i][k] != -1 && dist[k][j] != -1) {
                            if (dist[i][j] == -1 || dist[i][k] + dist[k][j] < dist[i][j]) {
                                dist[i][j] = dist[i][k] + dist[k][j];
                            }
                        }
                    }
                }
            }
            return dist;
        }
    }`
    },


    {
      title: `QUESTION:
    Find the city with the smallest number of reachable cities within distance threshold. If multiple, return the one with maximum index.
    
    EXAMPLE:
    Input: n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4
    Output: 3`,
    
      optimalComplexity: `Time Complexity: O(N³)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int findTheCity(int n, int[][] edges, int distanceThreshold) {
            int[][] dist = new int[n][n];
            for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE / 2);
            
            for (int i = 0; i < n; i++) dist[i][i] = 0;
            
            for (int[] e : edges) {
                dist[e[0]][e[1]] = e[2];
                dist[e[1]][e[0]] = e[2];
            }
            
            for (int k = 0; k < n; k++) {
                for (int i = 0; i < n; i++) {
                    for (int j = 0; j < n; j++) {
                        if (dist[i][k] + dist[k][j] < dist[i][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }
            
            int minCount = Integer.MAX_VALUE, city = -1;
            for (int i = 0; i < n; i++) {
                int count = 0;
                for (int j = 0; j < n; j++) {
                    if (i != j && dist[i][j] <= distanceThreshold) count++;
                }
                if (count <= minCount) {
                    minCount = count;
                    city = i;
                }
            }
            return city;
        }
    }`
    },


    {
      title: `QUESTION:      (NEW PATTERN)
    Minimum Spanning Tree (MST) is a subset of edges in a connected, undirected, weighted graph that connects all the vertices with the minimum possible total edge weight. No cycles are allowed in MST.`,
    
      optimalComplexity: `Prim's / Kruskal's - O(E log V)
    Space Complexity: O(V + E)`,
    
      optimalCode: `// MST Theory: Used in network design, clustering, etc.
     // Two main algorithms: Prim's (priority queue) and Kruskal's (Union-Find)`
    },



    {
      title: `QUESTION:
    Given a weighted undirected graph, find the sum of weights of edges in the Minimum Spanning Tree using Prim's Algorithm.
    
    EXAMPLE:
    Input: V = 5, edges = [[0,1,2],[0,2,1],[1,2,1],[2,3,2],[3,4,1]]
    Output: 5`,
    
      optimalComplexity: `Time Complexity: O(E log V)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int spanningTree(int V, ArrayList<ArrayList<ArrayList<Integer>>> adj) {
            boolean[] visited = new boolean[V];
            PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);       // Ascending (Min-Heap) — smallest weight polled first
            pq.offer(new int[]{0, 0}); // node, weight
            int sum = 0;
            
            while (!pq.isEmpty()) {
                int[] curr = pq.poll();
                int node = curr[0], wt = curr[1];
                
                if (visited[node]) continue;        // skip that node
                visited[node] = true;
                sum += wt;
                
                for (ArrayList<Integer> nei : adj.get(node)) {
                    int v = nei.get(0), weight = nei.get(1);
                    if (!visited[v]) {
                        pq.offer(new int[]{v, weight});     // PQ = [{2,wt=1}, {1,wt=2}]   ← min-heap reorders, wt=1 on top
                    }
                }
            }
            return sum;
        }
    }`
    },


    {
      title: `QUESTION:
    Implement Disjoint Set Union (DSU) with Path Compression and Union by Rank.
    
    EXAMPLE:
    Input: Operations on DSU`,
    
      optimalComplexity: `Time Complexity: O(α(N)) ~ almost constant
    Space Complexity: O(N)`,
    
      optimalCode: `class DisjointSet {
        int[] parent, rank;
        
        public DisjointSet(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        
        public int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path Compression
            }
            return parent[x];
        }
        
        public void union(int x, int y) {
            int px = find(x), py = find(y);
            if (px == py) return;
            
            if (rank[px] < rank[py]) {
                parent[px] = py;
            } else if (rank[px] > rank[py]) {
                parent[py] = px;
            } else {
                parent[py] = px;
                rank[px]++;
            }
        }
    }`
    },


    {
      title: `QUESTION:
    Given a weighted undirected graph, find the weight of the Minimum Spanning Tree using Kruskal's Algorithm.
    
    EXAMPLE:  Input: V = 4, adj = [[[1, 1], [3, 4]], [[0, 1], [2, 2]], [[1, 2], [3, 3]], [[0, 4], [2, 3]]]
    Output: 6

    Explanation: 
    Edges included in the MST:
    From node 0 → [1, 1] (weight 1)
    From node 1 → [2, 2] (weight 2)
    From node 2 → [3, 3] (weight 3)
    The total MST weight is 1 + 2 + 3 = 6.
    These edges connect all vertices (0, 1, 2, 3) with minimum cost.`,
    
      optimalComplexity: `Time Complexity: O(E log E)
    Space Complexity: O(V)`,
    
      optimalCode: `
          class DisjointSet {
              int[] parent;  // parent[i] = parent of node i
              int[] rank;    // rank[i]   = height of tree rooted at i

              // Constructor — initialize DSU for V nodes
              DisjointSet(int V) {
                  parent = new int[V];   // create parent array of size V
                  rank   = new int[V];   // create rank array of size V

                  for (int i = 0; i < V; i++) {
                      parent[i] = i;     // each node is its own parent (own group)
                      rank[i]   = 0;     // each node starts with rank 0
                  }
              }
              int find(int x) {
                  if (parent[x] != x) {              // if x is NOT its own parent
                      parent[x] = find(parent[x]);   // recursively find root + compress path
                  }
                  return parent[x];                  // return root of x's group
              }
              void union(int x, int y) {
                  int rootX = find(x);   // find root of x's group
                  int rootY = find(y);   // find root of y's group

                  if (rootX == rootY) return;   // already in same group, nothing to do
                  if (rank[rootX] < rank[rootY]) {
                      parent[rootX] = rootY;        // rootX goes under rootY
                  } else if (rank[rootX] > rank[rootY]) {
                      parent[rootY] = rootX;        // rootY goes under rootX
                  } else {
                      parent[rootY] = rootX;        // equal rank — attach rootY under rootX
                      rank[rootX]++;                // increase rank of rootX by 1
                  }
              }
          }

          class Solution {
              public int spanningTree(int V, ArrayList<ArrayList<ArrayList<Integer>>> adj) {
                  List<int[]> edges = new ArrayList<>();
                  for (int i = 0; i < V; i++) {
                      for (ArrayList<Integer> nei : adj.get(i)) {
                          if (i < nei.get(0)) {
                              // only add edge from SMALLER node's side
                              // avoids duplicate edges in undirected graph
                              // e.g. edge 0--1 added when i=0, skipped when i=1

                              edges.add(new int[]{i, nei.get(0), nei.get(1)});
                              // add {currentNode, neighborNode, weight}
                          }
                      }
                  }
                  // edges = [{0,1,1}, {0,3,4}, {1,2,2}, {2,3,3}]
                  edges.sort((a, b) -> a[2] - b[2]);
                  // edges = [{0,1,1}, {1,2,2}, {2,3,3}, {0,3,4}]
                  DisjointSet ds = new DisjointSet(V);
                  int mstWeight = 0;
                  for (int[] edge : edges) {
                      if (ds.find(edge[0]) != ds.find(edge[1])) {
                          // find(edge[0]) → root of node1's group
                          // find(edge[1]) → root of node2's group
                          // if roots are DIFFERENT → different groups → NO CYCLE

                          ds.union(edge[0], edge[1]);
                          // merge both groups together

                          mstWeight += edge[2];
                          // add edge weight to MST total
                      }
                      // if roots are SAME → same group → CYCLE → skip edge
                  }
                  return mstWeight;
                  // return 6
              }
          }`
    },



    {
      title: `QUESTION:
    Given n computers and connections, return the minimum number of operations (cable rearrangements) needed to make all computers connected. Return -1 if impossible.
    
    EXAMPLE:
    Input: n = 4, connections = [[0,1],[0,2],[1,2]]
    Output: 1`,
    
      optimalComplexity: `Time Complexity: O(N + E)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int makeConnected(int n, int[][] connections) {
            if (connections.length < n - 1) return -1;           //To connect n nodes in a tree, you ALWAYS need exactly n-1 edges
            
            DisjointSet ds = new DisjointSet(n);
            for (int[] conn : connections) {
                ds.union(conn[0], conn[1]);
            }
            
            int components = 0;
            for (int i = 0; i < n; i++) {
                if (ds.find(i) == i) components++;
            }
            return components - 1;
        }
    }`
    },


    {
      title: `QUESTION:
    Given stones on a 2D plane, remove a stone if there is another stone in the same row or column. Return maximum number of stones that can be removed.
    
    EXAMPLE:
    Input: stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]
    Output: 5`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int removeStones(int[][] stones) {
            int n = stones.length;
            DisjointSet ds = new DisjointSet(n);
            
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {      //If two stones are in the SAME ROW (stones[i][0] == stones[j][0]) 
                                                       //OR SAME COLUMN (stones[i][1] == stones[j][1]) → they are connected
                    if (stones[i][0] == stones[j][0] || stones[i][1] == stones[j][1]) {
                        ds.union(i, j);
                    }
                }
            }
            
            int components = 0;
            for (int i = 0; i < n; i++) {
                if (ds.find(i) == i) components++;
            }
            return n - components;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a list of accounts where each account contains emails. Merge accounts that belong to the same person (same email). Return the merged accounts.
    
    EXAMPLE:
    Input: accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"]]
    Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"]]`,
    
      optimalComplexity: `Time Complexity: O(N * α(N))
    Space Complexity: O(N)`,
    
      optimalCode: `
          class Solution {
              public List<List<String>> accountsMerge(List<List<String>> accounts) {
                  Map<String, Integer> emailToIndex = new HashMap<>();
                  DisjointSet ds = new DisjointSet(accounts.size());
                  for (int i = 0; i < accounts.size(); i++) {
                      for (int j = 1; j < accounts.get(i).size(); j++) {
                          // j starts from 1 because index 0 is NAME not email
                          String email = accounts.get(i).get(j);
                          // get current email from account i

                          if (emailToIndex.containsKey(email)) {
                              // email already seen before in another account
                              // means two accounts share this email → MERGE them

                              ds.union(i, emailToIndex.get(email));
                              // emailToIndex.get(email) = index of account
                              //                          where email first appeared
                              // union(i, firstAccount) → merge both accounts
                              //                          into same group

                          } else {
                              emailToIndex.put(email, i);           //STEP 1 → emailToIndex = { "j@j.com"→0, "jj@j.com"→0, "jjj@j.com"→1, "m@m.com"→2 },  union(0,1) because jj@j.com shared
                          }
                      }
                  }

                  Map<Integer, List<String>> rootToEmails = new HashMap<>();
                  for (String email : emailToIndex.keySet()) {
                      // loop over every unique email we have

                      int root = ds.find(emailToIndex.get(email));
                      // emailToIndex.get(email) → account index of this email
                      // ds.find(index)          → root/leader of that account's group

                      rootToEmails.computeIfAbsent(root, x -> new ArrayList<>()).add(email);         //STEP 2 → rootToEmails = { 0→["j@j.com","jj@j.com","jjj@j.com"],  2→["m@m.com"] }
                      // if root key doesn't exist in map → create new empty list for it
                      // then add email to that root's list
                  }
                  List<List<String>> result = new ArrayList<>();
                  for (int root : rootToEmails.keySet()) {
                      List<String> emails = rootToEmails.get(root);
                      Collections.sort(emails);
                      // sort emails alphabetically (required by problem)

                      emails.add(0, accounts.get(root).get(0));
                      // accounts.get(root).get(0) = NAME of the account
                      // add(0, name) → insert name at INDEX 0 (front of list)
                      // so final list = [name, email1, email2, ...]

                      result.add(emails);                          //STEP 3 → result = [ ["John","j@j.com","jj@j.com","jjj@j.com"], ["Mary","m@m.com"] ]
                  }

                  return result;
              }
          }`
    },


    {
      title: `QUESTION:
    You have an empty water grid. Land is added one by one at given positions. After each addition, count how many islands exist. Two land cells form one island if they are connected horizontally or vertically.    
    EXAMPLE:
    Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
    Output: [1,1,2,3] ->Return a list containing the number of islands after each land addition.`,
    
      optimalComplexity: `Time Complexity: O(K * α(M*N))
    Space Complexity: O(M*N)`,
    
      optimalCode: `
          class Solution {
              public List<Integer> numIslands2(int m, int n, int[][] positions) {
                  List<Integer> result = new ArrayList<>();
                  // stores island count after each land addition
                  // this is what we return at the end

                  DisjointSet ds = new DisjointSet(m * n);
                  // create DSU of size m*n (total cells in grid)
                  // each cell treated as a node
                  // m=3, n=3 → ds size = 9 nodes (0 to 8)

                  boolean[][] land = new boolean[m][n];
                  // tracks which cells are land
                  // land[i][j] = true  → cell is land
                  // land[i][j] = false → cell is water (default)

                  int islands = 0;
                  // current count of islands
                  // starts at 0 (all water)

                  int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
                  for (int[] pos : positions) {
                      int x = pos[0], y = pos[1];
                      int idx = x * n + y;
                      // convert 2D position to 1D index for DSU
                      // formula: row * totalCols + col
                      // e.g. (1,2) in 3x3 grid → 1*3+2 = 5
                      if (land[x][y]) {                                     //positions = [[0,0],[0,0],[1,2],[2,1]]  for this
                          // this cell is ALREADY land (duplicate position)
                          // no change in islands count

                          result.add(islands);
                          // add current count as is
                          continue;
                          // skip to next position
                      }
                      land[x][y] = true;
                      // mark this cell as land

                      islands++;
                      // new land = new island initially
                      // assume it's isolated, increment count
                      for (int[] d : dirs) {
                          // check all 4 directions

                          int nx = x + d[0], ny = y + d[1];
                          // nx = neighbor row
                          // ny = neighbor col
                          // e.g. if d={-1,0} → nx=x-1, ny=y (UP neighbor)

                          if (nx >= 0 && nx < m && ny >= 0 && ny < n && land[nx][ny]) {

                              int nidx = nx * n + ny;
                              // convert neighbor 2D position to 1D index
                              // same formula: row * totalCols + col

                              if (ds.find(idx) != ds.find(nidx)) {
                                  // find(idx)  → root of current cell's group
                                  // find(nidx) → root of neighbor cell's group
                                  // if roots DIFFERENT → different islands → merge

                                  ds.union(idx, nidx);
                                  // merge current cell and neighbor into same island

                                  islands--;
                                  // two islands merged into one → decrease count
                              }
                              // if roots SAME → already same island → do nothing
                          }
                      }

                      result.add(islands);
                  }

                  return result;
                  // return list of island counts after each addition
                  // e.g. [1, 1, 2, 3]
              }
          }`
    },


    {
      title: `QUESTION:
    You are given an n x n binary matrix grid. You can change at most one 0 to 1. Return the size of the largest island after this operation.
    
    EXAMPLE:
    Input: grid = [[1,0],[0,1]]
    Output: 3`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int largestIsland(int[][] grid) {
            int n = grid.length;
            DisjointSet ds = new DisjointSet(n * n);
            int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
            int maxSize = 0;
            
            // Connect existing islands
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (grid[i][j] == 1) {
                        int idx = i * n + j;
                        for (int[] d : dirs) {
                            int ni = i + d[0], nj = j + d[1];
                            if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                                int nidx = ni * n + nj;
                                ds.union(idx, nidx);
                            }
                        }
                    }
                }
            }
            
            // Try changing each 0 to 1
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (grid[i][j] == 0) {
                        Set<Integer> roots = new HashSet<>();
                        int size = 1;
                        for (int[] d : dirs) {
                            int ni = i + d[0], nj = j + d[1];
                            if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                                int root = ds.find(ni * n + nj);
                                if (!roots.contains(root)) {
                                    roots.add(root);
                                    size += getComponentSize(ds, ni * n + nj); // Simplified
                                }
                            }
                        }
                        maxSize = Math.max(maxSize, size);
                    }
                }
            }
            return maxSize == 0 ? n * n : maxSize;
        }
    }`
    },


    {
      title: `QUESTION:
    You are given an n x n integer matrix grid where each value grid[i][j] represents the elevation at that point. You start at (0,0) and want to reach (n-1, n-1). Return the least time until you can swim from top-left to bottom-right.
    
    EXAMPLE:
    Input: grid = [[0,2],[1,3]]
    Output: 3`,
    
      optimalComplexity: `Time Complexity: O(N² log N)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int swimInWater(int[][] grid) {
            int n = grid.length;
            int low = grid[0][0], high = 0;
            for (int[] row : grid) {
                for (int val : row) high = Math.max(high, val);
            }
            
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (canReach(grid, mid)) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
            return low;
        }
        
        private boolean canReach(int[][] grid, int t) {
            int n = grid.length;
            boolean[][] visited = new boolean[n][n];
            Queue<int[]> q = new LinkedList<>();
            q.offer(new int[]{0, 0});
            visited[0][0] = true;
            
            int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
            
            while (!q.isEmpty()) {
                int[] curr = q.poll();
                if (curr[0] == n-1 && curr[1] == n-1) return true;
                
                for (int[] d : dirs) {
                    int x = curr[0] + d[0], y = curr[1] + d[1];
                    if (x >= 0 && x < n && y >= 0 && y < n && !visited[x][y] && grid[x][y] <= t) {
                        visited[x][y] = true;
                        q.offer(new int[]{x, y});
                    }
                }
            }
            return false;
        }
    }`
    },

    {
      title: `QUESTION:
    Given an undirected connected graph with V vertices and E edges, find all the bridges in the graph. A bridge is an edge whose removal increases the number of connected components.
    
    EXAMPLE:
    Input: V = 5, edges = [[0,1],[0,2],[1,2],[0,3],[3,4]]
    Output: [[0,3],[3,4]]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
            List<List<Integer>> adj = new ArrayList<>();
            for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
            
            for (List<Integer> edge : connections) {
                adj.get(edge.get(0)).add(edge.get(1));
                adj.get(edge.get(1)).add(edge.get(0));
            }
            
            List<List<Integer>> bridges = new ArrayList<>();
            int[] disc = new int[n];
            int[] low = new int[n];
            boolean[] visited = new boolean[n];
            Arrays.fill(disc, -1);
            Arrays.fill(low, -1);
            
            dfs(0, -1, adj, disc, low, visited, bridges, 0);
            return bridges;
        }
        
        private int time = 0;
        
        private void dfs(int node, int parent, List<List<Integer>> adj, int[] disc, int[] low, 
                         boolean[] visited, List<List<Integer>> bridges, int timer) {
            visited[node] = true;
            disc[node] = low[node] = timer++;
            
            for (int nei : adj.get(node)) {
                if (nei == parent) continue;
                
                if (!visited[nei]) {
                    dfs(nei, node, adj, disc, low, visited, bridges, timer);
                    
                    low[node] = Math.min(low[node], low[nei]);
                    
                    if (low[nei] > disc[node]) {
                        bridges.add(Arrays.asList(node, nei));
                    }
                } else {
                    low[node] = Math.min(low[node], disc[nei]);
                }
            }
        }
    }`
    },



    {
      title: `QUESTION:
    Given an undirected connected graph with V vertices and E edges, find all the articulation points (cut vertices). An articulation point is a vertex whose removal increases the number of connected components.
    
    EXAMPLE:
    Input: V = 5, edges = [[0,1],[0,2],[1,2],[0,3],[3,4]]
    Output: [0,3]`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public List<Integer> articulationPoints(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            int[] disc = new int[V];
            int[] low = new int[V];
            boolean[] ap = new boolean[V];
            int[] parent = new int[V];
            Arrays.fill(disc, -1);
            Arrays.fill(low, -1);
            Arrays.fill(parent, -1);
            
            List<Integer> result = new ArrayList<>();
            int time = 0;
            
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    dfs(i, adj, visited, disc, low, parent, ap, time, result);
                }
            }
            
            Collections.sort(result);
            return result;
        }
        
        private void dfs(int u, ArrayList<ArrayList<Integer>> adj, boolean[] visited, int[] disc, 
                         int[] low, int[] parent, boolean[] ap, int time, List<Integer> result) {
            int children = 0;
            visited[u] = true;
            disc[u] = low[u] = time++;
            
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    children++;
                    parent[v] = u;
                    dfs(v, adj, visited, disc, low, parent, ap, time, result);
                    
                    low[u] = Math.min(low[u], low[v]);
                    
                    // Root node check
                    if (parent[u] == -1 && children > 1) ap[u] = true;
                    
                    // Non-root node check
                    if (parent[u] != -1 && low[v] >= disc[u]) ap[u] = true;
                } else if (v != parent[u]) {
                    low[u] = Math.min(low[u], disc[v]);
                }
            }
            
            if (ap[u] && !result.contains(u)) {
                result.add(u);
            }
        }
    }`
    },


    {
      title: `QUESTION:
    Given a directed graph with V vertices and E edges, find the number of Strongly Connected Components (SCCs) using Kosaraju's Algorithm.
    
    EXAMPLE:
    Input: V = 5, edges = [[0,1],[1,2],[2,0],[1,3],[3,4],[4,3]]
    Output: 2`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `class Solution {
        public int kosaraju(int V, ArrayList<ArrayList<Integer>> adj) {
            boolean[] visited = new boolean[V];
            Stack<Integer> stack = new Stack<>();
            
            // Step 1: DFS on original graph to fill stack
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    dfs1(adj, i, visited, stack);
                }
            }
            
            // Step 2: Reverse the graph
            ArrayList<ArrayList<Integer>> transpose = new ArrayList<>();
            for (int i = 0; i < V; i++) transpose.add(new ArrayList<>());
            
            for (int i = 0; i < V; i++) {
                for (int nei : adj.get(i)) {
                    transpose.get(nei).add(i);
                }
            }
            
            // Step 3: DFS on transpose graph in order of stack
            Arrays.fill(visited, false);
            int sccCount = 0;
            
            while (!stack.isEmpty()) {
                int node = stack.pop();
                if (!visited[node]) {
                    dfs2(transpose, node, visited);
                    sccCount++;
                }
            }
            return sccCount;
        }
        
        private void dfs1(ArrayList<ArrayList<Integer>> adj, int node, boolean[] visited, Stack<Integer> stack) {
            visited[node] = true;
            for (int nei : adj.get(node)) {
                if (!visited[nei]) {
                    dfs1(adj, nei, visited, stack);
                }
            }
            stack.push(node);
        }
        
        private void dfs2(ArrayList<ArrayList<Integer>> transpose, int node, boolean[] visited) {
            visited[node] = true;
            for (int nei : transpose.get(node)) {
                if (!visited[nei]) {
                    dfs2(transpose, nei, visited);
                }
            }
        }
    }`
    },




  ],



  "dynamic-programming":[
    {
      title: `QUESTION:
    You are climbing a staircase with n steps. Each time you can either climb 1 or 2 steps. Return the number of distinct ways you can climb to the top.
    
    EXAMPLE:
    Input: n = 3
    Output: 3
    Explanation: There are 3 ways to climb: (1,1,1), (1,2), (2,1)`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int climbStairs(int n) {
            return ways(n);
        }
        
        private int ways(int n) {
            if (n == 0) return 1;
            if (n < 0) return 0;
            return ways(n - 1) + ways(n - 2);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int climbStairs(int n) {
            if (n <= 1) return 1;
            int[] dp = new int[n + 1];
            dp[0] = 1;
            dp[1] = 1;
            
            for (int i = 2; i <= n; i++) {
                dp[i] = dp[i - 1] + dp[i - 2];
            }
            return dp[n];
        }
    }`
    },


    {
      title: `QUESTION:
    A frog wants to climb a staircase with n steps. Given an integer array heights,
    where heights[i] contains the height of the ith step.
    To jump from the ith step to the jth step, the frog requires abs(heights[i] - heights[j]) energy.
    The frog can jump either 1 or 2 steps at a time.
    Return the minimum energy required to go from 0th step to (n-1)th step.
    
    EXAMPLE:
    Input: heights = [2, 1, 3, 5, 4]
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int frogJump(int[] heights) {
            int n = heights.length;
            return helper(heights, n - 1);
        }
    
        private int helper(int[] heights, int i) {
            if (i == 0) return 0;
    
            int oneStep = helper(heights, i - 1)+ Math.abs(heights[i] - heights[i - 1]);
    
            int twoStep = Integer.MAX_VALUE;
            if (i - 2 >= 0) {
                twoStep = helper(heights, i - 2)+ Math.abs(heights[i] - heights[i - 2]);
            }
    
            return Math.min(oneStep, twoStep);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int frogJump(int[] heights) {
            int n = heights.length;
            int[] dp = new int[n];
            dp[0] = 0;
    
            for (int i = 1; i < n; i++) {
                int oneStep = dp[i - 1]+ Math.abs(heights[i] - heights[i - 1]);
    
                int twoStep = Integer.MAX_VALUE;
                if (i - 2 >= 0) {
                    twoStep = dp[i - 2]+ Math.abs(heights[i] - heights[i - 2]);
                }
    
                dp[i] = Math.min(oneStep, twoStep);
            }
            return dp[n - 1];
        }
    }`
    },


    {
      title: `QUESTION:
    A frog wants to climb a staircase with n steps. Given an integer array heights, where heights[i] contains the height of the ith step, and an integer k.
    To jump from the ith step to the jth step, the frog requires abs(heights[i] - heights[j]) energy.
    The frog can jump from the ith step to any step in the range [i+1, i+k].
    Return the minimum energy required to go from 0th step to (n-1)th step.
    
    EXAMPLE:
    Input: heights = [10, 5, 20, 0, 15], k = 2
    Output: 15`,
    
      bruteForceComplexity: `Time Complexity: O(k^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int frogJumpK(int[] heights, int k) {
            int n = heights.length;
            return helper(heights, n - 1, k);
        }
    
        private int helper(int[] heights, int i, int k) {
            if (i == 0) return 0;
    
            int minCost = Integer.MAX_VALUE;
            for (int j = 1; j <= k; j++) {
                if (i - j >= 0) {
                    int cost = helper(heights, i - j, k)+ Math.abs(heights[i] - heights[i - j]);
                    minCost = Math.min(minCost, cost);
                }
            }
            return minCost;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N*K)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int frogJumpK(int[] heights, int k) {
            int n = heights.length;
            int[] dp = new int[n];
            dp[0] = 0;
    
            for (int i = 1; i < n; i++) {
                dp[i] = Integer.MAX_VALUE;
                for (int j = 1; j <= k; j++) {
                    if (i - j >= 0) {
                        int cost = dp[i - j]+ Math.abs(heights[i] - heights[i - j]);
                        dp[i] = Math.min(dp[i], cost);
                    }
                }
            }
            return dp[n - 1];
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of integers, find the maximum sum of a subsequence such that no two numbers are adjacent in the array.
    
    EXAMPLE:
    Input: arr = [2,1,4,9]
    Output: 11`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int maximumNonAdjacentSum(int[] nums) {
            return helper(nums, nums.length - 1);
        }
        
        private int helper(int[] nums, int i) {
            if (i < 0) return 0;
            if (i == 0) return nums[0];
            
            int take = nums[i] + helper(nums, i - 2);
            int notTake = helper(nums, i - 1);
            return Math.max(take, notTake);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maximumNonAdjacentSum(int[] nums) {
            int n = nums.length;
            if (n == 1) return nums[0];
            
            int[] dp = new int[n];
            dp[0] = nums[0];
            dp[1] = Math.max(nums[0], nums[1]);
            
            for (int i = 2; i < n; i++) {
                dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
            }
            return dp[n-1];
        }
    }`
    },


    {
      title: `QUESTION:
    You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. You cannot rob adjacent houses. Return the maximum amount you can rob.
    
    EXAMPLE:
    Input: nums = [2,7,9,3,1]
    Output: 12`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int rob(int[] nums) {
            return helper(nums, nums.length - 1);
        }
        
        private int helper(int[] nums, int i) {
            if (i < 0) return 0;
            if (i == 0) return nums[0];
            
            int take = nums[i] + helper(nums, i - 2);
            int notTake = helper(nums, i - 1);
            return Math.max(take, notTake);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int rob(int[] nums) {
            int n = nums.length;
            if (n == 1) return nums[0];
            if (n == 2) return Math.max(nums[0], nums[1]);
            
            int[] dp = new int[n];
            dp[0] = nums[0];
            dp[1] = Math.max(nums[0], nums[1]);
            
            for (int i = 2; i < n; i++) {
                dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
            }
            return dp[n-1];
        }
    }`
    },


    {
      title: `QUESTION: (NEW PATTERN)
    Ninja has to train for N days. Each day he can perform one of three activities (0,1,2) with given points. He cannot do the same activity on two consecutive days. Find the maximum points Ninja can earn.
    
    EXAMPLE:
    Input: points = [[1,2,5],[3,1,1],[3,3,3]]
    Output: 11`,
    
      bruteForceComplexity: `Time Complexity: O(3^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int maximumPoints(int[][] points, int n) {
            return helper(points, n-1, 3);
        }
        
        private int helper(int[][] points, int day, int last) {
            if (day == 0) {
                int max = 0;
                for (int i = 0; i < 3; i++) {
                    if (i != last) max = Math.max(max, points[0][i]);
                }
                return max;
            }
            
            int maxPoints = 0;
            for (int i = 0; i < 3; i++) {
                if (i != last) {
                    int point = points[day][i] + helper(points, day-1, i);
                    maxPoints = Math.max(maxPoints, point);
                }
            }
            return maxPoints;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `
      class Solution {
        class Solution {
            public int maximumPoints(int[][] points, int n) {
                int[][] dp = new int[n][3]; // dp[day][task] = max points till that day ending with that task

                // base case: day 0, just take points as it is for each task
                dp[0][0] = points[0][0]; // dp[0][0] = 1
                dp[0][1] = points[0][1]; // dp[0][1] = 2
                dp[0][2] = points[0][2]; // dp[0][2] = 5

                // fill dp for each day from 1 to n-1
                for (int day = 1; day < n; day++) {
                    for (int task = 0; task < 3; task++) { // try each task for current day
                        dp[day][task] = points[day][task];  // start with current day points
                        int maxPrev = 0;
                        for (int prev = 0; prev < 3; prev++) { // check all previous tasks
                            if (prev != task) {                 // can't do same task on consecutive days
                                maxPrev = Math.max(maxPrev, dp[day-1][prev]); // pick best prev task
                            }
                        }
                        dp[day][task] += maxPrev; // add best previous to current
                    }
                }
                // answer is max of all tasks on last day
                return Math.max(dp[n-1][0], Math.max(dp[n-1][1], dp[n-1][2]));
            }
        }`
    },



    {
      title: `QUESTION:
    Given an m x n grid, find the number of unique paths from top-left cell to bottom-right cell. You can only move either down or right.
    
    EXAMPLE:
    Input: m = 3, n = 7
    Output: 28`,
    
      bruteForceComplexity: `Time Complexity: O(2^(m+n))
    Space Complexity: O(m+n)`,
    
      bruteForceCode: `class Solution {
        public int uniquePaths(int m, int n) {
            return helper(m-1, n-1);
        }
        
        private int helper(int i, int j) {
            if (i == 0 && j == 0) return 1;
            if (i < 0 || j < 0) return 0;
            return helper(i-1, j) + helper(i, j-1);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int uniquePaths(int m, int n) {
            int[][] dp = new int[m][n];
            
            for (int i = 0; i < m; i++) dp[i][0] = 1;
            for (int j = 0; j < n; j++) dp[0][j] = 1;
            
            for (int i = 1; i < m; i++) {
                for (int j = 1; j < n; j++) {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
            return dp[m-1][n-1];
        }
    }`
    },


    {
      title: `QUESTION:
    Given a grid with obstacles (1 = obstacle, 0 = empty), find the number of unique paths from top-left to bottom-right.
    
    EXAMPLE:
    Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(2^(m+n))
    Space Complexity: O(m+n)`,
    
      bruteForceCode: `class Solution {
        public int uniquePathsWithObstacles(int[][] obstacleGrid) {
            int m = obstacleGrid.length;
            int n = obstacleGrid[0].length;
            return helper(obstacleGrid, m-1, n-1);
        }
        
        private int helper(int[][] grid, int i, int j) {
            if (i < 0 || j < 0 || grid[i][j] == 1) return 0;
            if (i == 0 && j == 0) return 1;
            return helper(grid, i-1, j) + helper(grid, i, j-1);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int uniquePathsWithObstacles(int[][] obstacleGrid) {
            int m = obstacleGrid.length;
            int n = obstacleGrid[0].length;
            int[][] dp = new int[m][n];
            
            if (obstacleGrid[0][0] == 1) return 0;
            dp[0][0] = 1;
            
            for (int j = 1; j < n; j++) {
                dp[0][j] = (obstacleGrid[0][j] == 0) ? dp[0][j-1] : 0;
            }
            for (int i = 1; i < m; i++) {
                dp[i][0] = (obstacleGrid[i][0] == 0) ? dp[i-1][0] : 0;
            }
            
            for (int i = 1; i < m; i++) {
                for (int j = 1; j < n; j++) {
                    if (obstacleGrid[i][j] == 0) {
                        dp[i][j] = dp[i-1][j] + dp[i][j-1];
                    }
                }
            }
            return dp[m-1][n-1];
        }
    }`
    },



    {
      title: `QUESTION:
    Given an n x n matrix, return the minimum sum of any falling path from top row to bottom row. You can move down, down-left, or down-right.
    
    EXAMPLE:
    Input: matrix = [[2,1,3],[6,5,4],[7,8,9]]
    Output: 13`,
    
      bruteForceComplexity: `Time Complexity: O(3^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int minFallingPathSum(int[][] matrix) {
            int n = matrix.length;
            int minSum = Integer.MAX_VALUE;
            for (int j = 0; j < n; j++) {
                minSum = Math.min(minSum, helper(matrix, 0, j));
            }
            return minSum;
        }
        
        private int helper(int[][] matrix, int i, int j) {
            if (i == matrix.length - 1) return matrix[i][j];
            if (j < 0 || j >= matrix.length) return Integer.MAX_VALUE;
            
            int down = helper(matrix, i+1, j);
            int left = helper(matrix, i+1, j-1);
            int right = helper(matrix, i+1, j+1);
            
            return matrix[i][j] + Math.min(down, Math.min(left, right));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int minFallingPathSum(int[][] matrix) {
            int n = matrix.length;
            int[][] dp = new int[n][n];
            
            for (int j = 0; j < n; j++) dp[0][j] = matrix[0][j];
            
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    int down = dp[i-1][j];
                    int left = (j > 0) ? dp[i-1][j-1] : Integer.MAX_VALUE;
                    int right = (j < n-1) ? dp[i-1][j+1] : Integer.MAX_VALUE;
                    dp[i][j] = matrix[i][j] + Math.min(down, Math.min(left, right));
                }
            }
            
            int minSum = Integer.MAX_VALUE;
            for (int j = 0; j < n; j++) {
                minSum = Math.min(minSum, dp[n-1][j]);
            }
            return minSum;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a triangle, find the minimum path sum from top to bottom. You can only move to adjacent numbers in the row below.
    
    EXAMPLE:
    Input: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
    Output: 11`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int minimumTotal(List<List<Integer>> triangle) {
            return helper(triangle, 0, 0);
        }
        
        private int helper(List<List<Integer>> triangle, int i, int j) {
            if (i == triangle.size() - 1) return triangle.get(i).get(j);
            int down = helper(triangle, i+1, j);
            int downRight = helper(triangle, i+1, j+1);
            return triangle.get(i).get(j) + Math.min(down, downRight);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int minimumTotal(List<List<Integer>> triangle) {
            int n = triangle.size();
            int[][] dp = new int[n][n];
            
            for (int j = 0; j < n; j++) {
                dp[n-1][j] = triangle.get(n-1).get(j);
            }
            
            for (int i = n-2; i >= 0; i--) {
                for (int j = 0; j <= i; j++) {
                    dp[i][j] = triangle.get(i).get(j) + Math.min(dp[i+1][j], dp[i+1][j+1]);
                }
            }
            return dp[0][0];
        }
    }`
    },


    {
      title: `QUESTION:
    Two ninjas start from (0,0) and (0, M-1) and move to the bottom row. They can move down, down-left, or down-right. Maximize the total cherries collected. If both visit same cell, count it only once.
    
    EXAMPLE:
    Input: grid = [[3,1,1],[2,5,1],[1,5,5],[2,1,1]]
    Output: 24`,
    
      bruteForceComplexity: `Time Complexity: Exponential
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int maximumChocolates(int r, int c, int[][] grid) {
            return helper(grid, 0, 0, c-1);
        }
        
        private int helper(int[][] grid, int i, int j1, int j2) {
            if (i == grid.length - 1) {
                return (j1 == j2) ? grid[i][j1] : grid[i][j1] + grid[i][j2];
            }
            
            int max = 0;
            for (int dj1 = -1; dj1 <= 1; dj1++) {
                for (int dj2 = -1; dj2 <= 1; dj2++) {
                    int nj1 = j1 + dj1, nj2 = j2 + dj2;
                    if (nj1 >= 0 && nj1 < grid[0].length && nj2 >= 0 && nj2 < grid[0].length) {
                        int chocolates = (j1 == j2) ? grid[i][j1] : grid[i][j1] + grid[i][j2];
                        max = Math.max(max, chocolates + helper(grid, i+1, nj1, nj2));
                    }
                }
            }
            return max;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * M * M)
    Space Complexity: O(N * M * M)`,
    
      optimalCode: `class Solution {
        public int maximumChocolates(int r, int c, int[][] grid) {
            int[][][] dp = new int[r][c][c];
            
            for (int j1 = 0; j1 < c; j1++) {
                for (int j2 = 0; j2 < c; j2++) {
                    dp[r-1][j1][j2] = (j1 == j2) ? grid[r-1][j1] : grid[r-1][j1] + grid[r-1][j2];
                }
            }
            
            for (int i = r-2; i >= 0; i--) {
                for (int j1 = 0; j1 < c; j1++) {
                    for (int j2 = 0; j2 < c; j2++) {
                        int max = 0;
                        for (int dj1 = -1; dj1 <= 1; dj1++) {
                            for (int dj2 = -1; dj2 <= 1; dj2++) {
                                int nj1 = j1 + dj1, nj2 = j2 + dj2;
                                if (nj1 >= 0 && nj1 < c && nj2 >= 0 && nj2 < c) {
                                    int val = dp[i+1][nj1][nj2];
                                    max = Math.max(max, val);
                                }
                            }
                        }
                        dp[i][j1][j2] = (j1 == j2 ? grid[i][j1] : grid[i][j1] + grid[i][j2]) + max;
                    }
                }
            }
            return dp[0][0][c-1];
        }
    }`
    },


    {
      title: `QUESTION:   (NEW PATTERN)
    Given an array of non-negative integers and a target sum,
    return true if there exists a subset with sum equal to target.
    
    EXAMPLE:
    Input: nums = [1, 2, 3, 7], target = 6
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean subsetSum(int[] nums, int target) {
            int n = nums.length;
            return solve(nums, n, target);
        }
    
        private boolean solve(int[] nums, int i, int j) {
            // Base cases
            if (j == 0) return true;   // sum achieved
            if (i == 0) return false;  // no elements left
    
            if (nums[i-1] <= j && solve(nums, i - 1, j - nums[i-1]) == true) {
                return true;           // include current element
            } else {
                return solve(nums, i - 1, j); // exclude current element
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * target)
    Space Complexity: O(N * target)`,
    
      optimalCode: `class Solution {
        public boolean subsetSum(int[] nums, int target) {
            int n = nums.length;
            boolean[][] dp = new boolean[n + 1][target + 1];
    
            // base case: sum = 0 is always achievable (empty subset)
            for (int i = 0; i <= n; i++) dp[i][0] = true;
    
            // base case: no elements, sum > 0 never achievable
            for (int j = 1; j <= target; j++) dp[0][j] = false;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= target; j++) {
    
                    if (nums[i-1] <= j && dp[i-1][j - nums[i-1]] == true) {
                        dp[i][j] = true;      // include current element
                    } else {
                        dp[i][j] = dp[i-1][j]; // exclude current element
                    }
                }
            }
    
            return dp[n][target];
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array, return true if it can be partitioned into
    two subsets with equal sum.
    
    EXAMPLE:
    Input: nums = [1, 5, 11, 5]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean canPartition(int[] nums) {
            int total = 0;
            for (int x : nums) total += x;
    
            // if total is odd, can't split into equal halves
            if (total % 2 != 0) return false;
    
            int target = total / 2; // just find if subset with sum = target exists
            int n = nums.length;
            return solve(nums, n, target);
        }
    
        private boolean solve(int[] nums, int i, int j) {
            // Base cases
            if (j == 0) return true;   // subset found
            if (i == 0) return false;  // no elements left
    
            if (nums[i-1] <= j && solve(nums, i - 1, j - nums[i-1]) == true) {
                return true;            // include current element
            } else {
                return solve(nums, i - 1, j); // exclude current element
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * total/2)
    Space Complexity: O(N * total/2)`,
    
      optimalCode: `class Solution {
        public boolean canPartition(int[] nums) {
            int total = 0;
            for (int x : nums) total += x;
    
            // if total is odd, can't split into equal halves
            if (total % 2 != 0) return false;
    
            int target = total / 2; // just find if subset with sum = target exists
            int n = nums.length;
            boolean[][] dp = new boolean[n + 1][target + 1];
    
            // base case: sum = 0 always achievable (empty subset)
            for (int i = 0; i <= n; i++) dp[i][0] = true;
    
            // base case: no elements, sum > 0 never achievable
            for (int j = 1; j <= target; j++) dp[0][j] = false;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= target; j++) {
    
                    if (nums[i-1] <= j && dp[i-1][j - nums[i-1]] == true) {
                        dp[i][j] = true;       // include current element
                    } else {
                        dp[i][j] = dp[i-1][j]; // exclude current element
                    }
                }
            }
    
            return dp[n][target];
        }
    }`
    },


    {
      title: `QUESTION:
    Partition the array into two subsets such that the absolute
    difference of their sums is minimized. Return that minimum difference.
    
    EXAMPLE:
    Input: arr = [1, 6, 11, 5]
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int minimumDifference(int[] arr) {
            int n = arr.length;
            int total = 0;
            for (int x : arr) total += x;
            return solve(arr, n, total, 0);
        }
    
        private int solve(int[] arr, int i, int total, int currSum) {
            // Base case: no elements left
            if (i == 0) {
                int s1 = currSum;
                int s2 = total - currSum;
                return Math.abs(s1 - s2);
            }
    
            // include current element in subset 1
            int include = solve(arr, i - 1, total, currSum + arr[i-1]);
    
            // exclude current element from subset 1
            int exclude = solve(arr, i - 1, total, currSum);
    
            return Math.min(include, exclude);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * total)
    Space Complexity: O(N * total)`,
    
      optimalCode: `class Solution {
        public int minimumDifference(int[] arr) {
            int n = arr.length;
            int total = 0;
            for (int x : arr) total += x;
    
            // step 1: fill subset sum dp table
            boolean[][] dp = new boolean[n + 1][total + 1];
    
            // base case: sum = 0 always achievable
            for (int i = 0; i <= n; i++) dp[i][0] = true;
    
            // base case: no elements, sum > 0 never achievable
            for (int j = 1; j <= total; j++) dp[0][j] = false;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= total; j++) {
    
                    if (arr[i-1] <= j && dp[i-1][j - arr[i-1]] == true) {
                        dp[i][j] = true;       // include current element
                    } else {
                        dp[i][j] = dp[i-1][j]; // exclude current element
                    }
                }
            }
    
            // step 2: check last row for all achievable subset sums
            // s1 = j, s2 = total - j, diff = |s2 - s1| = |total - 2*j|
            int minDiff = Integer.MAX_VALUE;
            for (int j = 0; j <= total / 2; j++) {
                if (dp[n][j] == true) {
                    minDiff = Math.min(minDiff, Math.abs(total - 2 * j));
                }
            }
    
            return minDiff;
        }
    }`
    },


    {
      title: `QUESTION:
    Count the number of subsets with sum equal to K.
    
    EXAMPLE:
    Input: arr = [1, 2, 3, 3], K = 6
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int countSubsets(int[] arr, int K) {
            int n = arr.length;
            return solve(arr, n, K);
        }
    
        private int solve(int[] arr, int i, int j) {
            // Base cases
            if (j == 0) return 1;   // valid subset found
            if (i == 0) return 0;   // no elements left, sum not achieved
    
            if (arr[i-1] <= j) {
                int include = solve(arr, i - 1, j - arr[i-1]); // include current
                int exclude = solve(arr, i - 1, j);             // exclude current
                return include + exclude;                        // count both ways
            } else {
                return solve(arr, i - 1, j);                    // can't include
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * K)
    Space Complexity: O(N * K)`,
    
      optimalCode: `class Solution {
        public int countSubsets(int[] arr, int K) {
            int n = arr.length;
            int[][] dp = new int[n + 1][K + 1];
    
            // base case: sum = 0 has exactly 1 subset (empty subset)
            for (int i = 0; i <= n; i++) dp[i][0] = 1;
    
            // base case: no elements, sum > 0 has 0 subsets
            for (int j = 1; j <= K; j++) dp[0][j] = 0;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 0; j <= K; j++) {
    
                    if (arr[i-1] <= j) {
                        int include = dp[i-1][j - arr[i-1]]; // count with current
                        int exclude = dp[i-1][j];             // count without current
                        dp[i][j] = include + exclude;         // total count
                    } else {
                        dp[i][j] = dp[i-1][j];               // can't include
                    }
                }
            }
    
            return dp[n][K];
        }
    }`
    },



    {
      title: `QUESTION:
    Count the number of ways to partition the array into two
    subsets with given difference d.
    
    EXAMPLE:
    Input: arr = [5, 2, 6, 4], d = 3
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int countPartitions(int[] arr, int d) {
            int n = arr.length;
            int total = 0;
            for (int x : arr) total += x;
    
            // s1 - s2 = d and s1 + s2 = total
            // solving → s1 = (total + d) / 2
            if ((total + d) % 2 != 0) return 0;  // not possible
            if ((total + d) < 0) return 0;        // invalid
    
            int target = (total + d) / 2;
            return solve(arr, n, target);
        }
    
        private int solve(int[] arr, int i, int j) {
            // Base cases
            if (j == 0) return 1;   // valid subset found
            if (i == 0) return 0;   // no elements left
    
            if (arr[i-1] <= j) {
                int include = solve(arr, i - 1, j - arr[i-1]); // include current
                int exclude = solve(arr, i - 1, j);             // exclude current
                return include + exclude;                        // count both ways
            } else {
                return solve(arr, i - 1, j);                    // can't include
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * target)
    Space Complexity: O(N * target)`,
    
      optimalCode: `class Solution {
        public int countPartitions(int[] arr, int d) {
            int n = arr.length;
            int total = 0;
            for (int x : arr) total += x;
    
            // s1 - s2 = d and s1 + s2 = total
            // solving → s1 = (total + d) / 2
            if ((total + d) % 2 != 0) return 0;  // not possible
            if ((total + d) < 0) return 0;        // invalid
    
            int target = (total + d) / 2;
            int[][] dp = new int[n + 1][target + 1];
    
            // base case: sum = 0 has exactly 1 subset (empty subset)
            for (int i = 0; i <= n; i++) dp[i][0] = 1;
    
            // base case: no elements, sum > 0 has 0 subsets
            for (int j = 1; j <= target; j++) dp[0][j] = 0;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 0; j <= target; j++) {
    
                    if (arr[i-1] <= j) {
                        int include = dp[i-1][j - arr[i-1]]; // count with current
                        int exclude = dp[i-1][j];             // count without current
                        dp[i][j] = include + exclude;         // total count
                    } else {
                        dp[i][j] = dp[i-1][j];               // can't include
                    }
                }
            }
    
            return dp[n][target];
        }
    }`
    },



    {
      title: `QUESTION:
    Assign cookies to children such that each child gets at most
    one cookie and is content. Maximize number of content children.
    Each child i has greed factor g[i], each cookie j has size s[j].
    Child i is content if s[j] >= g[i].
    
    EXAMPLE:
    Input: g = [1, 2, 3], s = [1, 1]
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int findContentChildren(int[] g, int[] s) {
            Arrays.sort(g); // sort greed factors
            Arrays.sort(s); // sort cookie sizes
            int count = 0;
    
            for (int i = 0; i < g.length; i++) {       // each child
                for (int j = 0; j < s.length; j++) {   // each cookie
                    if (s[j] >= g[i] && s[j] != -1) {  // cookie satisfies child
                        count++;
                        s[j] = -1;  // mark cookie as used
                        break;
                    }
                }
            }
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N + M log M)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int findContentChildren(int[] g, int[] s) {
            Arrays.sort(g); // sort greed factors  ascending
            Arrays.sort(s); // sort cookie sizes   ascending
    
            int child  = 0; // pointer for children
            int cookie = 0; // pointer for cookies
    
            while (child < g.length && cookie < s.length) {
    
                if (s[cookie] >= g[child]) { // cookie satisfies child
                    child++;                 // move to next child
                }
                cookie++;                    // always move to next cookie
            }
    
            return child; // number of content children
        }
    }`
    },




    {
      title: `QUESTION:
    Find the fewest number of coins needed to make up the amount.
    Return -1 if impossible.
    
    EXAMPLE:
    Input: coins = [1, 2, 5], amount = 11
    Output: 3  (5 + 5 + 1)`,
    
      bruteForceComplexity: `Time Complexity: O(amount^N)
    Space Complexity: O(amount)`,
    
      bruteForceCode: `class Solution {
        public int coinChange(int[] coins, int amount) {
            int n = coins.length;
            int ans = solve(coins, n, amount);
            return ans >= Integer.MAX_VALUE ? -1 : ans; // impossible case
        }
    
        private int solve(int[] coins, int i, int j) {
            // Base cases
            if (j == 0) return 0;                // no amount left, 0 coins needed
            if (i == 0) return Integer.MAX_VALUE; // no coins left, impossible
    
            if (coins[i-1] <= j) {
                int include = solve(coins, i, j - coins[i-1]); // reuse same coin (unbounded)
                if (include != Integer.MAX_VALUE) include += 1; // add 1 for current coin
                int exclude = solve(coins, i - 1, j);           // skip this coin
                return Math.min(include, exclude);
            } else {
                return solve(coins, i - 1, j);                  // can't include
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * amount)
    Space Complexity: O(N * amount)`,
    
      optimalCode: `class Solution {
        public int coinChange(int[] coins, int amount) {
            int n = coins.length;
            int[][] dp = new int[n + 1][amount + 1];
    
            // base case: amount = 0 needs 0 coins
            for (int i = 0; i <= n; i++) dp[i][0] = 0;
    
            // base case: no coins, amount > 0 is impossible
            for (int j = 1; j <= amount; j++) dp[0][j] = Integer.MAX_VALUE;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= amount; j++) {
    
                    if (coins[i-1] <= j && dp[i][j - coins[i-1]] != Integer.MAX_VALUE) {
                        int include = 1 + dp[i][j - coins[i-1]]; // reuse same coin (unbounded)
                        int exclude = dp[i-1][j];                 // skip this coin
                        dp[i][j] = Math.min(include, exclude);
                    } else {
                        dp[i][j] = dp[i-1][j];                   // can't include
                    }
                }
            }
    
            return dp[n][amount] == Integer.MAX_VALUE ? -1 : dp[n][amount];
        }
    }`
    },



    {
      title: `QUESTION:
    You are given an integer array nums and an integer target.
    You can assign + or - sign to each number.
    Return the number of different ways to assign signs
    so that the sum equals target.
    
    EXAMPLE:
    Input: nums = [1, 1, 1, 1, 1], target = 3
    Output: 5`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int findTargetSumWays(int[] nums, int target) {
            int n = nums.length;
            return solve(nums, n, target);
        }
    
        private int solve(int[] nums, int i, int j) {
            // Base case
            if (i == 0 && j == 0) return 1;  // valid assignment found
            if (i == 0) return 0;             // no elements left, target not met
    
            // assign + to current element
            int plus  = solve(nums, i - 1, j - nums[i-1]);
    
            // assign - to current element
            int minus = solve(nums, i - 1, j + nums[i-1]);
    
            return plus + minus;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * target)
    Space Complexity: O(N * target)`,
    
      optimalCode: `class Solution {
        public int findTargetSumWays(int[] nums, int target) {
            int n = nums.length;
            int total = 0;
            for (int x : nums) total += x;
    
            // + subset = s1, - subset = s2
            // s1 - s2 = target  and  s1 + s2 = total
            // solving → s1 = (total + target) / 2
            if (Math.abs(target) > total) return 0;       // impossible
            if ((total + target) % 2 != 0) return 0;      // not integer
    
            int k = (total + target) / 2;                 // count subsets with sum k
            int[][] dp = new int[n + 1][k + 1];
    
            // base case: sum = 0 has exactly 1 subset (empty subset)
            for (int i = 0; i <= n; i++) dp[i][0] = 1;
    
            // base case: no elements, sum > 0 has 0 subsets
            for (int j = 1; j <= k; j++) dp[0][j] = 0;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 0; j <= k; j++) {
    
                    if (nums[i-1] <= j) {
                        int include = dp[i-1][j - nums[i-1]]; // include in + subset
                        int exclude = dp[i-1][j];              // exclude from + subset
                        dp[i][j] = include + exclude;
                    } else {
                        dp[i][j] = dp[i-1][j];                // can't include
                    }
                }
            }
    
            return dp[n][k];
        }
    }`
    },


    {
      title: `QUESTION:
    Given coins of different denominations and a total amount,
    return the number of combinations that make up that amount.
    
    EXAMPLE:
    Input: amount = 5, coins = [1, 2, 5]
    Output: 4  (5), (1+2+2), (1+1+1+2), (1+1+1+1+1)`,
    
      bruteForceComplexity: `Time Complexity: O(amount^N)
    Space Complexity: O(amount)`,
    
      bruteForceCode: `class Solution {
        public int change(int amount, int[] coins) {
            int n = coins.length;
            return solve(coins, n, amount);
        }
    
        private int solve(int[] coins, int i, int j) {
            // Base cases
            if (j == 0) return 1;  // valid combination found
            if (i == 0) return 0;  // no coins left, amount not met
    
            if (coins[i-1] <= j) {
                int include = solve(coins, i, j - coins[i-1]); // reuse same coin (unbounded)
                int exclude = solve(coins, i - 1, j);           // skip this coin
                return include + exclude;
            } else {
                return solve(coins, i - 1, j);                  // can't include
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * amount)
    Space Complexity: O(N * amount)`,
    
      optimalCode: `class Solution {
        public int change(int amount, int[] coins) {
            int n = coins.length;
            int[][] dp = new int[n + 1][amount + 1];
    
            // base case: amount = 0 has exactly 1 combination (empty)
            for (int i = 0; i <= n; i++) dp[i][0] = 1;
    
            // base case: no coins, amount > 0 has 0 combinations
            for (int j = 1; j <= amount; j++) dp[0][j] = 0;
    
            for (int i = 1; i <= n; i++) {
                for (int j = 0; j <= amount; j++) {
    
                    if (coins[i-1] <= j) {
                        int include = dp[i][j - coins[i-1]];  // reuse same coin (unbounded)
                        int exclude = dp[i-1][j];              // skip this coin
                        dp[i][j] = include + exclude;          // total combinations
                    } else {
                        dp[i][j] = dp[i-1][j];                // can't include
                    }
                }
            }
    
            return dp[n][amount];
        }
    }`
    },


    {
      title: `QUESTION:
    Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value. You can use unlimited number of each item.
    
    EXAMPLE:
    Input: W = 8, wt = [1,3,4,5], val = [1,4,5,7]
    Output: 11`,
    
      bruteForceComplexity: `Time Complexity: Exponential
    Space Complexity: O(N)`,
    
      bruteForceCode: `
      public int knapsack(int[] wt, int[] val, int capacity) {
          int n = wt.length;
          return solve(wt, val, n, capacity);
      }

      private int solve(int[] wt, int[] val, int i, int j) {
          // Base case
          if (i == 0 || j == 0) return 0;

          if (wt[i-1] <= j) {
              int include = val[i-1] + solve(wt, val, i-1, j - wt[i-1]);
              int exclude = solve(wt, val, i-1, j);
              return Math.max(include, exclude);
          } else {
              return solve(wt, val, i-1, j);
          }
      }`,
    
      optimalComplexity: `Time Complexity: O(N * W)
    Space Complexity: O(N * W)`,
    
      optimalCode: `
      class Solution {
        public int knapsack(int[] wt, int[] val, int capacity) {
            int n = wt.length;
            int[][] dp = new int[n + 1][capacity + 1];

            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= capacity; j++) {

                    if (wt[i-1] <= j) {
                        int include = val[i-1] + dp[i-1][j - wt[i-1]];
                        int exclude = dp[i-1][j];
                        dp[i][j] = Math.max(include, exclude);
                    } else {
                        dp[i][j] = dp[i-1][j];
                    }
                }
            }

            return dp[n][capacity];
        }`
    },


    {
      title: `QUESTION:
    Given a rod of length N and prices for pieces of different lengths, find the maximum value obtainable by cutting the rod into pieces.
    
    EXAMPLE:
    Input: N = 8, price = [1,5,8,9,10,17,17,20]
    Output: 22`,
    
      bruteForceComplexity: `Time Complexity: Exponential
    Space Complexity: O(N)`,
    
      bruteForceCode: `
      class Solution {
        public int rodCutting(int[] lengths, int[] prices, int n) {
            return solve(lengths, prices, n, n);
        }

        private int solve(int[] lengths, int[] prices, int i, int j) {
            // Base case
            if (i == 0 || j == 0) return 0;

            if (lengths[i-1] <= j) {
                int include = prices[i-1] + solve(lengths, prices, i, j - lengths[i-1]); // i not i-1 (reuse same piece)
                int exclude = solve(lengths, prices, i-1, j);
                return Math.max(include, exclude);
            } else {
                return solve(lengths, prices, i-1, j);
            }
        }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `
      class Solution {
        public int rodCutting(int[] lengths, int[] prices, int n) {
            int[][] dp = new int[n + 1][n + 1];

            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= n; j++) {

                    if (lengths[i-1] <= j) {
                        int include = prices[i-1] + dp[i][j - lengths[i-1]]; // i not i-1 (reuse same piece)
                        int exclude = dp[i-1][j];
                        dp[i][j] = Math.max(include, exclude);
                    } else {
                        dp[i][j] = dp[i-1][j];
                    }
                }
            }

            return dp[n][n];
        }`
    },



    {
      title: `QUESTION:         (NEW PATTERN)
    Given two strings text1 and text2, return the length of their longest common subsequence.
    
    EXAMPLE:
    Input: text1 = "abcde", text2 = "ace"
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(2^(M+N))
    Space Complexity: O(M+N)`,
    
      bruteForceCode: `class Solution {
        public int longestCommonSubsequence(String text1, String text2) {
            return helper(text1, text2, text1.length()-1, text2.length()-1);
        }
        
        private int helper(String s1, String s2, int i, int j) {
            if (i < 0 || j < 0) return 0;
            if (s1.charAt(i) == s2.charAt(j)) {
                return 1 + helper(s1, s2, i-1, j-1);
            }
            return Math.max(helper(s1, s2, i-1, j), helper(s1, s2, i, j-1));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int longestCommonSubsequence(String text1, String text2) {
            int m = text1.length(), n = text2.length();
            int[][] dp = new int[m+1][n+1];
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (text1.charAt(i-1) == text2.charAt(j-1)) {
                        dp[i][j] = 1 + dp[i-1][j-1];
                    } else {
                        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    }
                }
            }
            return dp[m][n];
        }
    }`
    },


    {
      title: `QUESTION:
    Print one Longest Common Subsequence of two given strings.
    
    EXAMPLE:
    Input: text1 = "abcde", text2 = "ace"
    Output: "ace"`,
    
      bruteForceComplexity: `Time Complexity: O(2^(M+N))
    Space Complexity: O(M+N)`,
    
      bruteForceCode: `// Recursive backtracking to build string`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public String printLCS(String s1, String s2) {
            int m = s1.length(), n = s2.length();
            int[][] dp = new int[m+1][n+1];
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s1.charAt(i-1) == s2.charAt(j-1)) {
                        dp[i][j] = 1 + dp[i-1][j-1];
                    } else {
                        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    }
                }
            }
            
            // Backtrack to construct LCS
            StringBuilder sb = new StringBuilder();
            int i = m, j = n;
            while (i > 0 && j > 0) {
                if (s1.charAt(i-1) == s2.charAt(j-1)) {
                    sb.append(s1.charAt(i-1));
                    i--; j--;
                } else if (dp[i-1][j] > dp[i][j-1]) {
                    i--;
                } else {
                    j--;
                }
            }
            return sb.reverse().toString();
        }
    }`
    },


    {
      title: `QUESTION:
    Return the length of the longest common substring of two strings.
    
    EXAMPLE:
    Input: s1 = "abcde", s2 = "abfce"
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(M * N * min(M,N))
    Space Complexity: O(1)`,
    
      bruteForceCode: `// Check all possible substrings`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int longestCommonSubstring(String s1, String s2) {
            int m = s1.length(), n = s2.length();
            int[][] dp = new int[m+1][n+1];
            int maxLen = 0;
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s1.charAt(i-1) == s2.charAt(j-1)) {
                        dp[i][j] = dp[i-1][j-1] + 1;
                        maxLen = Math.max(maxLen, dp[i][j]);
                    }
                }
            }
            return maxLen;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a string s, return the length of the longest palindromic subsequence.
    
    EXAMPLE:
    Input: s = "bbbab"
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: Exponential
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int longestPalindromeSubseq(String s) {
            return helper(s, 0, s.length()-1);
        }
        
        private int helper(String s, int i, int j) {
            if (i > j) return 0;
            if (i == j) return 1;
            if (s.charAt(i) == s.charAt(j)) {
                return 2 + helper(s, i+1, j-1);
            }
            return Math.max(helper(s, i+1, j), helper(s, i, j-1));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `
        public int longestPalindromeSubseq(String s) {
            int n = s.length();
            String rev = new StringBuilder(s).reverse().toString();
            int[][] dp = new int[n + 1][n + 1];

            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s.charAt(i - 1) == rev.charAt(j - 1)) {
                        dp[i][j] = 1 + dp[i - 1][j - 1]; // ✅
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // ✅
                    }
                }
            }
            return dp[n][n];
        }`
    },



    {
      title: `QUESTION:
    Given a string s, find the minimum number of insertions needed to make it a palindrome.
    
    EXAMPLE:
    Input: s = "ab"
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursive approach`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N²)`,
    
      optimalCode: `
      class Solution {
        public int minInsertions(String s) {
            int n = s.length();
            String rev = new StringBuilder(s).reverse().toString();
            int[][] dp = new int[n + 1][n + 1];

            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s.charAt(i - 1) == rev.charAt(j - 1)) {
                        dp[i][j] = 1 + dp[i - 1][j - 1];
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }

            int lps = dp[n][n];
            return n - lps; // minimum insertions = total chars - longest palindromic subsequence
        }`
    },



    {
      title: `QUESTION:
    Find minimum number of insertions and deletions to convert string A to string B.
    
    EXAMPLE:
    Input: A = "abcd", B = "anc"
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursive LCS based`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int minOperations(String s1, String s2) {
            int m = s1.length(), n = s2.length();
            int lcs = lcsLength(s1, s2);
            return (m - lcs) + (n - lcs);
        }
        
        private int lcsLength(String s1, String s2) {
            int m = s1.length(), n = s2.length();
            int[][] dp = new int[m+1][n+1];
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s1.charAt(i-1) == s2.charAt(j-1)) {
                        dp[i][j] = 1 + dp[i-1][j-1];
                    } else {
                        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    }
                }
            }
            return dp[m][n];
        }
    }`
    },


    {
      title: `QUESTION:
    Return the shortest common supersequence of two strings.
    
    EXAMPLE:
    Input: str1 = "abac", str2 = "cab"
    Output: "cabac"`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursive`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public String shortestCommonSupersequence(String str1, String str2) {
            int m = str1.length(), n = str2.length();
            int[][] dp = new int[m+1][n+1];
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (str1.charAt(i-1) == str2.charAt(j-1)) {
                        dp[i][j] = 1 + dp[i-1][j-1];
                    } else {
                        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    }
                }
            }
            
            // Construct SCS
            StringBuilder sb = new StringBuilder();
            int i = m, j = n;
            while (i > 0 && j > 0) {
                if (str1.charAt(i-1) == str2.charAt(j-1)) {
                    sb.append(str1.charAt(i-1));
                    i--; j--;
                } else if (dp[i-1][j] > dp[i][j-1]) {
                    sb.append(str1.charAt(i-1));
                    i--;
                } else {
                    sb.append(str2.charAt(j-1));
                    j--;
                }
            }
            while (i > 0) sb.append(str1.charAt(--i));
            while (j > 0) sb.append(str2.charAt(--j));
            return sb.reverse().toString();
        }
    }`
    },



    {
      title: `QUESTION:
    Given two strings s and t, return the number of distinct subsequences of s which equals t.
    
    EXAMPLE:
    Input: s = "rabbbit", t = "rabbit"
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `class Solution {
        public int numDistinct(String s, String t) {
            return helper(s, t, s.length()-1, t.length()-1);
        }
        
        private int helper(String s, String t, int i, int j) {
            if (j < 0) return 1;
            if (i < 0) return 0;
            if (s.charAt(i) == t.charAt(j)) {
                return helper(s, t, i-1, j-1) + helper(s, t, i-1, j);
            }
            return helper(s, t, i-1, j);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int numDistinct(String s, String t) {
            int m = s.length(), n = t.length();
            int[][] dp = new int[m+1][n+1];
            
            for (int i = 0; i <= m; i++) dp[i][0] = 1;
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (s.charAt(i-1) == t.charAt(j-1)) {
                        dp[i][j] = dp[i-1][j-1] + dp[i-1][j];
                    } else {
                        dp[i][j] = dp[i-1][j];
                    }
                }
            }
            return dp[m][n];
        }
    }`
    },


    {
      title: `QUESTION:
    Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, replace).
    
    EXAMPLE:
    Input: word1 = "horse", word2 = "ros"
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `class Solution {
        public int minDistance(String word1, String word2) {
            return helper(word1, word2, word1.length()-1, word2.length()-1);
        }
        
        private int helper(String w1, String w2, int i, int j) {
            if (i < 0) return j + 1;
            if (j < 0) return i + 1;
            if (w1.charAt(i) == w2.charAt(j)) return helper(w1, w2, i-1, j-1);
            return 1 + Math.min(Math.min(helper(w1,w2,i-1,j), helper(w1,w2,i,j-1)), helper(w1,w2,i-1,j-1));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int minDistance(String word1, String word2) {
            int m = word1.length(), n = word2.length();
            int[][] dp = new int[m+1][n+1];
            
            for (int i = 0; i <= m; i++) dp[i][0] = i;
            for (int j = 0; j <= n; j++) dp[0][j] = j;
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (word1.charAt(i-1) == word2.charAt(j-1)) {
                        dp[i][j] = dp[i-1][j-1];
                    } else {
                        dp[i][j] = 1 + Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]);
                    }
                }
            }
            return dp[m][n];
        }
    }`
    },



    {
      title: `QUESTION:
    Implement wildcard pattern matching with '?' and '*'.
    
    EXAMPLE:
    Input: s = "aa", p = "a*"
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `class Solution {
        public boolean isMatch(String s, String p) {
            return helper(s, p, s.length()-1, p.length()-1);
        }
        
        private boolean helper(String s, String p, int i, int j) {
            if (i < 0 && j < 0) return true;
            if (j < 0) return false;
            if (i < 0) {
                while (j >= 0 && p.charAt(j) == '*') j--;
                return j < 0;
            }
            if (p.charAt(j) == '?' || p.charAt(j) == s.charAt(i)) {
                return helper(s, p, i-1, j-1);
            }
            if (p.charAt(j) == '*') {
                return helper(s, p, i-1, j) || helper(s, p, i, j-1);
            }
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public boolean isMatch(String s, String p) {
            int m = s.length(), n = p.length();
            boolean[][] dp = new boolean[m+1][n+1];
            dp[0][0] = true;
            
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j-1) == '*') dp[0][j] = dp[0][j-1];
            }
            
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (p.charAt(j-1) == '?' || p.charAt(j-1) == s.charAt(i-1)) {
                        dp[i][j] = dp[i-1][j-1];
                    } else if (p.charAt(j-1) == '*') {
                        dp[i][j] = dp[i-1][j] || dp[i][j-1];
                    }
                }
            }
            return dp[m][n];
        }
    }`
    },


    {
      title: `QUESTION:       (NEW PATTERN)
    Given an integer array nums, return the length of the longest strictly increasing subsequence.
    
    EXAMPLE:
    Input: nums = [10,9,2,5,3,7,101,18]
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int lengthOfLIS(int[] nums) {
            return helper(nums, 0, -1);
        }
        
        private int helper(int[] nums, int i, int prevIdx) {
            if (i == nums.length) return 0;
            int notTake = helper(nums, i+1, prevIdx);
            int take = 0;
            if (prevIdx == -1 || nums[i] > nums[prevIdx]) {
                take = 1 + helper(nums, i+1, i);
            }
            return Math.max(take, notTake);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int lengthOfLIS(int[] nums) {
            int n = nums.length;
            int[] dp = new int[n];
            Arrays.fill(dp, 1);
            
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (nums[i] > nums[j]) {
                        dp[i] = Math.max(dp[i], dp[j] + 1);
                    }
                }
            }
            
            int max = 0;
            for (int len : dp) max = Math.max(max, len);
            return max;
        }
    }`
    },


    {
      title: `QUESTION:
    Print one Longest Increasing Subsequence from the given array.
    
    EXAMPLE:
    Input: nums = [10,9,2,5,3,7,101,18]
    Output: [2,3,7,101]`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)`,
    
      bruteForceCode: `// Recursive backtracking`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<Integer> printLIS(int[] nums) {
            int n = nums.length;
            int[] dp = new int[n];
            int[] prev = new int[n];
            Arrays.fill(dp, 1);
            Arrays.fill(prev, -1);
            
            int maxLen = 1, lastIdx = 0;
            
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (nums[i] > nums[j] && dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        prev[i] = j;
                    }
                }
                if (dp[i] > maxLen) {
                    maxLen = dp[i];
                    lastIdx = i;
                }
            }
            
            List<Integer> lis = new ArrayList<>();
            while (lastIdx != -1) {
                lis.add(nums[lastIdx]);
                lastIdx = prev[lastIdx];
            }
            Collections.reverse(lis);
            return lis;
        }
    }`
    },


    {
      title: `QUESTION:
    Return the length of the Longest Increasing Subsequence (Standard DP-43 problem).`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Same as problem 1`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `// Same as problem 1 (Tabulation)` 
    },



    {
      title: `QUESTION:
    Given a set of distinct positive integers nums, return the largest subset such that every pair (si, sj) of elements in this subset satisfies si % sj == 0 or sj % si == 0.
    
    EXAMPLE:
    Input: nums = [1,2,3]
    Output: [1,2]`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)`,
    
      bruteForceCode: `// Recursive subset check`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<Integer> largestDivisibleSubset(int[] nums) {
            Arrays.sort(nums);
            int n = nums.length;
            int[] dp = new int[n];
            int[] prev = new int[n];
            Arrays.fill(dp, 1);
            Arrays.fill(prev, -1);
            
            int maxLen = 1, lastIdx = 0;
            
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (nums[i] % nums[j] == 0 && dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        prev[i] = j;
                    }
                }
                if (dp[i] > maxLen) {
                    maxLen = dp[i];
                    lastIdx = i;
                }
            }
            
            List<Integer> result = new ArrayList<>();
            while (lastIdx != -1) {
                result.add(nums[lastIdx]);
                lastIdx = prev[lastIdx];
            }
            Collections.reverse(result);
            return result;
        }
    }`
    },



    {
      title: `QUESTION:
    Given a list of words, return the length of the longest string chain. A word can be predecessor of another if we can insert exactly one letter anywhere without changing the order of other characters.
    
    EXAMPLE:
    Input: words = ["a","b","ba","bca","bda","bdca"]
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursive chain building`,
    
      optimalComplexity: `Time Complexity: O(N² * L)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int longestStrChain(String[] words) {
            Arrays.sort(words, (a,b) -> a.length() - b.length());
            int n = words.length;
            int[] dp = new int[n];
            Arrays.fill(dp, 1);
            int maxChain = 1;
            
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (isPredecessor(words[j], words[i]) && dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                    }
                }
                maxChain = Math.max(maxChain, dp[i]);
            }
            return maxChain;
        }
        
        private boolean isPredecessor(String a, String b) {
            if (a.length() + 1 != b.length()) return false;
            int i = 0, j = 0;
            while (i < a.length() && j < b.length()) {
                if (a.charAt(i) == b.charAt(j)) i++;
                j++;
            }
            return i == a.length();
        }
    }`
    },


    {
      title: `QUESTION:
    Find the length of the longest bitonic subsequence. A bitonic subsequence is first strictly increasing then strictly decreasing.
    
    EXAMPLE:
    Input: nums = [1,11,2,10,4,5,2,1]
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursive`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int longestBitonicSequence(int[] nums) {
            int n = nums.length;
            int[] lis = new int[n];
            int[] lds = new int[n];
            Arrays.fill(lis, 1);
            Arrays.fill(lds, 1);
            
            // Longest Increasing
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (nums[i] > nums[j]) lis[i] = Math.max(lis[i], lis[j] + 1);
                }
            }
            
            // Longest Decreasing from right
            for (int i = n-2; i >= 0; i--) {
                for (int j = n-1; j > i; j--) {
                    if (nums[i] > nums[j]) lds[i] = Math.max(lds[i], lds[j] + 1);
                }
            }
            
            int max = 0;
            for (int i = 0; i < n; i++) {
                max = Math.max(max, lis[i] + lds[i] - 1);
            }
            return max;
        }
    }`
    },


    {
      title: `QUESTION:
    Given an integer array nums, return the number of longest increasing subsequences.
    
    EXAMPLE:
    Input: nums = [1,3,5,4,7]
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursive counting`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int findNumberOfLIS(int[] nums) {
            int n = nums.length;
            int[] dp = new int[n];
            int[] count = new int[n];
            Arrays.fill(dp, 1);
            Arrays.fill(count, 1);
            
            int maxLen = 1;
            
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (nums[i] > nums[j]) {
                        if (dp[j] + 1 > dp[i]) {
                            dp[i] = dp[j] + 1;
                            count[i] = count[j];
                        } else if (dp[j] + 1 == dp[i]) {
                            count[i] += count[j];
                        }
                    }
                }
                maxLen = Math.max(maxLen, dp[i]);
            }
            
            int result = 0;
            for (int i = 0; i < n; i++) {
                if (dp[i] == maxLen) result += count[i];
            }
            return result;
        }
    }`
    },



    {
      title: `QUESTION:      (NEW PATTERN)
    Given a chain of matrices, find the minimum number of scalar multiplications needed to multiply them all together.
    
    EXAMPLE:
    Input: arr = [40, 20, 30, 10, 30]
    Output: 26000`,
    
      bruteForceComplexity: `Time Complexity: O(3^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int matrixMultiplication(int[] arr) {
            return helper(arr, 1, arr.length - 1);
        }
        
        private int helper(int[] arr, int i, int j) {
            if (i == j) return 0;
            int minCost = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int cost = helper(arr, i, k) + helper(arr, k+1, j) + arr[i-1] * arr[k] * arr[j];
                minCost = Math.min(minCost, cost);
            }
            return minCost;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N³)
    Space Complexity: O(N²)`,
    
      optimalCode: `class Solution {
        public int matrixMultiplication(int[] arr) {
            int n = arr.length;
            int[][] dp = new int[n][n];
            
            for (int len = 2; len < n; len++) {
                for (int i = 1; i < n - len + 1; i++) {
                    int j = i + len - 1;
                    dp[i][j] = Integer.MAX_VALUE;
                    for (int k = i; k < j; k++) {
                        int cost = dp[i][k] + dp[k+1][j] + arr[i-1] * arr[k] * arr[j];
                        dp[i][j] = Math.min(dp[i][j], cost);
                    }
                }
            }
            return dp[1][n-1];
        }
    }`
    },



    {
      title: `QUESTION:
    Matrix Chain Multiplication using Bottom-Up Tabulation approach (Standard DP-49).`,
    
      bruteForceComplexity: `Time Complexity: O(3^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Same as above`,
    
      optimalComplexity: `Time Complexity: O(N³)
    Space Complexity: O(N²)`,
    
      optimalCode: `// Same as above (Tabulation)` 
    },



    {
      title: `QUESTION:
    Given a stick of length n and an array of cuts, find the minimum cost to cut the stick at all given positions.
    
    EXAMPLE:
    Input: n = 7, cuts = [1,3,4,5]
    Output: 16 
    1→3→4→5 = 7+6+4+3 = 20
    4→3→5→1 = 7+4+3+3 = 17
    3→5→1→4 = 7+4+3+2 = 16 ✅`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `
      class Solution {
          public int minCost(int n, int[] cuts) {
              Arrays.sort(cuts);
              // Add boundaries
              int[] arr = new int[cuts.length + 2];
              arr[0] = 0;
              arr[arr.length - 1] = n;
              for (int i = 0; i < cuts.length; i++) {
                  arr[i + 1] = cuts[i];
              }
              return helper(arr, 1, cuts.length);
          }
          private int helper(int[] arr, int i, int j) {
              // No cuts left
              if (i > j)
                  return 0;
              int minCost = Integer.MAX_VALUE;
              // Try every cut as the first cut
              for (int k = i; k <= j; k++) {
                  int cost = helper(arr, i, k - 1)+ helper(arr, k + 1, j)+ (arr[j + 1] - arr[i - 1]);
                  minCost = Math.min(minCost, cost);
              }
              return minCost;
          }
      }`,
    
      optimalComplexity: `Time Complexity: O(N³)
    Space Complexity: O(N²)`,
    
      optimalCode: `
      class Solution {
          public int minCost(int n, int[] cuts) {
              Arrays.sort(cuts);
              // Add boundaries 0 and n
              int[] arr = new int[cuts.length + 2];
              arr[0] = 0;
              arr[arr.length - 1] = n;
              for (int i = 0; i < cuts.length; i++) {
                  arr[i + 1] = cuts[i];
              }

              int m = arr.length;
              int[][] dp = new int[m][m];
              // Same loops as Matrix Chain Multiplication
              for (int len = 2; len < m; len++) {
                  for (int i = 1; i < m - len + 1; i++) {
                      int j = i + len - 1;
                      dp[i][j] = Integer.MAX_VALUE;
                      for (int k = i; k <= j; k++) {
                          int cost = dp[i][k - 1]
                                  + dp[k + 1][j]
                                  + (arr[j + 1] - arr[i - 1]);
                          dp[i][j] = Math.min(dp[i][j], cost);
                      }
                  }
              }

              return dp[1][m - 2];
          }
      }`
    },



    {
      title: `QUESTION:
    Given n balloons, burst all of them. Find the maximum coins you can collect.
    
    EXAMPLE:
    Input: nums = [3,1,5,8]
    Output: 167
    120 + 3 + 5 + 40 = 168`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `
        class Solution {
            public int maxCoins(int[] nums) {
                int n = nums.length;
                // Add virtual balloons
                int[] arr = new int[n + 2];
                arr[0] = 1;
                arr[n + 1] = 1;
                for (int i = 0; i < n; i++) {
                    arr[i + 1] = nums[i];
                }
                return helper(arr, 1, n);
            }

            private int helper(int[] arr, int i, int j) {
                if (i > j)
                    return 0;
                int maxCoins = 0;
                for (int k = i; k <= j; k++) {
                    int coins =helper(arr, i, k - 1)+ helper(arr, k + 1, j)+ arr[i - 1] * arr[k] * arr[j + 1];
                    maxCoins = Math.max(maxCoins, coins);
                }
                return maxCoins;
            }
        }`,
    
      optimalComplexity: `Time Complexity: O(N³)
    Space Complexity: O(N²)`,
    
      optimalCode: `
        class Solution {
            public int maxCoins(int[] nums) {
                int n = nums.length;
                int[] arr = new int[n + 2];
                arr[0] = 1;
                arr[n + 1] = 1;
                for (int i = 0; i < n; i++) {
                    arr[i + 1] = nums[i];
                }
                int[][] dp = new int[n + 2][n + 2];
                for (int len = 2; len <= n + 1; len++) {
                    for (int i = 1; i <= n - len + 2; i++) {
                        int j = i + len - 2;
                        for (int k = i; k <= j; k++) {
                            int coins =
                                    dp[i][k - 1]
                                  + dp[k + 1][j]
                                  + arr[i - 1] * arr[k] * arr[j + 1];
                            dp[i][j] = Math.max(dp[i][j], coins);
                        }
                    }
                }
                return dp[1][n];
            }
        }`
    },

    {
      title: `QUESTION:
    Given a string s, partition s such that every substring of the partition is a palindrome.
    Return the minimum cuts needed for a palindrome partitioning of s.
    
    EXAMPLE:
    Input: s = "aab"
    Output: 1
    Explanation: The palindrome partitioning ["aa", "b"] could be produced using 1 cut.`,
    
      bruteForceComplexity: `Time Complexity: O(2^N * N)
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int minCut(String s) {
            return solve(0, s) - 1;
        }
    
        private int solve(int start, String s) {
            if (start == s.length()) return 0;
    
            int minCuts = Integer.MAX_VALUE;
    
            for (int end = start; end < s.length(); end++) {
                if (isPalindrome(s, start, end)) {
                    int cuts = 1 + solve(end + 1, s);
                    minCuts = Math.min(minCuts, cuts);
                }
            }
            return minCuts;
        }
    
        private boolean isPalindrome(String s, int l, int r) {
            while (l < r) {
                if (s.charAt(l++) != s.charAt(r--)) return false;
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(N)`,
    
      optimalCode: `
      class Solution {
          public int minCut(String s) {
              int n = s.length();
              int[] dp = new int[n];
              for (int i = 0; i < n; i++) {
                  int minCuts = i; // worst case: all single chars
                  for (int j = 0; j <= i; j++) {
                      if (isPalindrome(s, j, i)) {
                          minCuts = (j == 0) ? 0 : Math.min(minCuts, dp[j - 1] + 1);
                      }
                  }
                  dp[i] = minCuts;
              }
              return dp[n - 1];
          }

          // O(length) palindrome check using two pointers
          private boolean isPalindrome(String s, int l, int r) {
              while (l < r) {
                  if (s.charAt(l) != s.charAt(r)) return false;
                  l++;
                  r--;
              }
              return true;
          }
      }`
    },

    {
      title: `QUESTION:
    You are given an integer array arr with length n, and an integer k.
    You may partition arr into one or more contiguous sub-arrays, where each sub-array has length in the range 1 … k (inclusive).
    After you pick a partition, replace every element in each sub-array with the maximum value found in that sub-array. The array is modified in-place for the purpose of computing the total.
    Return the largest possible sum of the entire array after performing exactly one such partition-and-replace operation.
    
    EXAMPLE:
    Input: arr = [1,15,7,9,2,5,10], k = 3
    Output: 84
    Explanation:
    [1,15,7] → 15
    [9] → 9
    [2,5,10] → 10
    Final array sum = 84`,
    
      bruteForceComplexity: `Time Complexity: O(2^N * N)
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int maxSumAfterPartitioning(int[] arr, int k) {
            return solve(0, arr, k);
        }
    
        private int solve(int i, int[] arr, int k) {
            if (i == arr.length) return 0;
    
            int maxSum = 0;
            int curMax = 0;
    
            for (int j = i; j < arr.length && j < i + k; j++) {
                curMax = Math.max(curMax, arr[j]);
                int len = j - i + 1;
                maxSum = Math.max(maxSum, curMax * len + solve(j + 1, arr, k));
            }
    
            return maxSum;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * K)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maxSumAfterPartitioning(int[] arr, int k) {
            int n = arr.length;
            int[] dp = new int[n + 1];
    
            for (int i = n - 1; i >= 0; i--) {
                int curMax = 0;
                int best = 0;
    
                for (int j = i; j < n && j < i + k; j++) {
                    curMax = Math.max(curMax, arr[j]);
                    int len = j - i + 1;
                    best = Math.max(best, curMax * len + dp[j + 1]);
                }
    
                dp[i] = best;
            }
    
            return dp[0];
        }
    }`
    },


    {
      title: `QUESTION:
    Given a string expression of numbers and operators, return all possible results from computing all the different possible ways to group numbers and operators.
    
    EXAMPLE:
    Input: expression = "2-1-1"
    Output: [0,2]`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `class Solution {
        public List<Integer> diffWaysToCompute(String expression) {
            return helper(expression);
        }
        
        private List<Integer> helper(String s) {
            List<Integer> res = new ArrayList<>();
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);
                if (c == '+' || c == '-' || c == '*') {
                    List<Integer> left = helper(s.substring(0, i));
                    List<Integer> right = helper(s.substring(i+1));
                    for (int l : left) {
                        for (int r : right) {
                            if (c == '+') res.add(l + r);
                            else if (c == '-') res.add(l - r);
                            else res.add(l * r);
                        }
                    }
                }
            }
            if (res.isEmpty()) res.add(Integer.parseInt(s));
            return res;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N³)
    Space Complexity: O(N²)`,
    
      optimalCode: `// Memoized version is common, but for pure tabulation it's complex. Standard approach uses recursion with memo.` 
    },



    {
      title: `QUESTION:
    Given a binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.
    
    EXAMPLE:
    Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: O((M*N)^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maximalRectangle(char[][] matrix) {
            int maxArea = 0;
            int m = matrix.length, n = matrix[0].length;
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (matrix[i][j] == '1') {
                        maxArea = Math.max(maxArea, largestRectangleFrom(i, j, matrix));
                    }
                }
            }
            return maxArea;
        }
        
        private int largestRectangleFrom(int r, int c, char[][] matrix) {
            int m = matrix.length, n = matrix[0].length;
            int maxArea = 0;
            int width = n;
            // expand row by row downward
            for (int i = r; i < m && matrix[i][c] == '1'; i++) {
                // shrink width based on consecutive 1s
                for (int j = c; j < n; j++) {
                    if (matrix[i][j] == '0') {
                        width = j - c;
                        break;
                    }
                    width = Math.min(width, j - c + 1);
                }
                int height = i - r + 1;
                maxArea = Math.max(maxArea, height * width);
            }
            return maxArea;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N) or O(N)`,
    
      optimalCode: `class Solution {
        public int maximalRectangle(char[][] matrix) {
            if (matrix.length == 0) return 0;
            int m = matrix.length, n = matrix[0].length;
            int[] heights = new int[n];
            int maxArea = 0;
            
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    heights[j] = matrix[i][j] == '1' ? heights[j] + 1 : 0;
                }
                maxArea = Math.max(maxArea, largestRectangleArea(heights));
            }
            return maxArea;
        }
        
        private int largestRectangleArea(int[] heights) {
            int[] stack = new int[heights.length + 1];
            int top = -1;
            int maxArea = 0;
            
            for (int i = 0; i <= heights.length; i++) {
                int h = (i == heights.length) ? 0 : heights[i];
                while (top >= 0 && heights[stack[top]] > h) {
                    int height = heights[stack[top--]];
                    int width = (top == -1) ? i : i - stack[top] - 1;
                    maxArea = Math.max(maxArea, height * width);
                }
                stack[++top] = i;
            }
            return maxArea;
        }
    }`
    },



    {
      title: `QUESTION:
    Given an m x n binary matrix, return the number of square submatrices with all ones.
    
    EXAMPLE:
    Input: matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]]
    Output: 15`,
    
      bruteForceComplexity: `Time Complexity: O(M² * N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int countSquares(int[][] matrix) {
            int count = 0;
            int m = matrix.length, n = matrix[0].length;
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (matrix[i][j] == 1) {
                        count += countSquaresFrom(i, j, matrix);
                    }
                }
            }
            return count;
        }
        
        private int countSquaresFrom(int i, int j, int[][] matrix) {
            int m = matrix.length;
            int n = matrix[0].length;
            int count = 0;
            // try all possible square sizes starting from (i, j)
            for (int size = 1; i + size - 1 < m && j + size - 1 < n; size++) {
                boolean allOnes = true;
                for (int r = i; r < i + size; r++) {
                    for (int c = j; c < j + size; c++) {
                        if (matrix[r][c] == 0) {
                            allOnes = false;
                            break;
                        }
                    }
                    if (!allOnes) break;
                }
                if (allOnes) {
                    count++;
                } else {
                    break; // larger squares will also fail
                }
            }
            return count;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(M * N)
    Space Complexity: O(M * N)`,
    
      optimalCode: `class Solution {
        public int countSquares(int[][] matrix) {
            int m = matrix.length, n = matrix[0].length;
            int[][] dp = new int[m][n];
            int count = 0;
            
            for (int i = 0; i < m; i++) {
                dp[i][0] = matrix[i][0];
                count += dp[i][0];
            }
            for (int j = 1; j < n; j++) {
                dp[0][j] = matrix[0][j];
                count += dp[0][j];
            }
            
            for (int i = 1; i < m; i++) {
                for (int j = 1; j < n; j++) {
                    if (matrix[i][j] == 1) {
                        dp[i][j] = Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]) + 1;
                        count += dp[i][j];
                    }
                }
            }
            return count;
        }
    }`
    },


    {
      title: `QUESTION:
    You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
    
    EXAMPLE:
    Input: prices = [7,1,5,3,6,4]
    Output: 5`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int maxProfit(int[] prices) {
            int maxP = 0;
            for (int i = 0; i < prices.length; i++) {
                for (int j = i+1; j < prices.length; j++) {
                    maxP = Math.max(maxP, prices[j] - prices[i]);
                }
            }
            return maxP;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int[] prices) {
            int n = prices.length;
            int[] dp = new int[n]; // max profit up to day i
            int minPrice = prices[0];
            
            for (int i = 1; i < n; i++) {
                dp[i] = Math.max(dp[i-1], prices[i] - minPrice);
                minPrice = Math.min(minPrice, prices[i]);
            }
            return dp[n-1];
        }
    }`
    },


    {
      title: `QUESTION:
    You may complete as many transactions as you like. Return the maximum profit.
    
    EXAMPLE:
    Input: prices = [7,1,5,3,6,4]
    Output: 7`,
    
      bruteForceComplexity: `Time Complexity: O(2^N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int maxProfit(int[] prices) {
            return helper(prices, 0, true);
        }
        private int helper(int[] p, int i, boolean buy) {
            if (i == p.length) return 0;
            if (buy) return Math.max(helper(p,i+1,true), -p[i] + helper(p,i+1,false));
            else return Math.max(helper(p,i+1,false), p[i] + helper(p,i+1,true));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int[] prices) {
            int n = prices.length;
            int[][] dp = new int[n+1][2]; // dp[i][0] = max profit if not holding, dp[i][1] = holding
            
            dp[n][0] = dp[n][1] = 0;
            
            for (int i = n-1; i >= 0; i--) {
                for (int buy = 0; buy <= 1; buy++) {
                    if (buy == 1) {
                        dp[i][buy] = Math.max(dp[i+1][1], -prices[i] + dp[i+1][0]);
                    } else {
                        dp[i][buy] = Math.max(dp[i+1][0], prices[i] + dp[i+1][1]);
                    }
                }
            }
            return dp[0][1];
        }
    }`
    },


    {
      title: `QUESTION:
    You may complete at most two transactions. Return the maximum profit.
    
    EXAMPLE:
    Input: prices = [3,3,5,0,0,3,1,4]
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursion with k=2`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int[] prices) {
            int n = prices.length;
            int[][][] dp = new int[n+1][3][2]; // day, transactions left, holding
            
            for (int k = 0; k <= 2; k++) {
                dp[n][k][0] = dp[n][k][1] = 0;
            }
            
            for (int i = n-1; i >= 0; i--) {
                for (int k = 1; k <= 2; k++) {
                    for (int buy = 0; buy <= 1; buy++) {
                        if (buy == 1) {
                            dp[i][k][buy] = Math.max(dp[i+1][k][1], -prices[i] + dp[i+1][k][0]);
                        } else {
                            dp[i][k][buy] = Math.max(dp[i+1][k][0], prices[i] + dp[i+1][k-1][1]);
                        }
                    }
                }
            }
            return dp[0][2][1];
        }
    }`
    },


    {
      title: `QUESTION:
    You may complete at most k transactions. Return the maximum profit.
    
    EXAMPLE:
    Input: k = 2, prices = [2,4,1]
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursion with k`,
    
      optimalComplexity: `Time Complexity: O(N * K)
    Space Complexity: O(N * K)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int k, int[] prices) {
            int n = prices.length;
            int[][][] dp = new int[n+1][k+1][2];
            
            for (int i = 0; i <= n; i++) {
                for (int trans = 0; trans <= k; trans++) {
                    dp[i][trans][0] = dp[i][trans][1] = 0;
                }
            }
            
            for (int i = n-1; i >= 0; i--) {
                for (int trans = 1; trans <= k; trans++) {
                    for (int buy = 0; buy <= 1; buy++) {
                        if (buy == 1) {
                            dp[i][trans][buy] = Math.max(dp[i+1][trans][1], -prices[i] + dp[i+1][trans][0]);
                        } else {
                            dp[i][trans][buy] = Math.max(dp[i+1][trans][0], prices[i] + dp[i+1][trans-1][1]);
                        }
                    }
                }
            }
            return dp[0][k][1];
        }
    }`
    },

    {
      title: `QUESTION:
    You cannot buy stock on the next day after selling (cooldown period of 1 day).
    
    EXAMPLE:
    Input: prices = [1,2,3,0,2]
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursion with cooldown`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int[] prices) {
            int n = prices.length;
            if (n == 0) return 0;
            
            int[][] dp = new int[n+1][2];
            
            for (int i = n-1; i >= 0; i--) {
                for (int buy = 0; buy <= 1; buy++) {
                    if (buy == 1) {
                        dp[i][buy] = Math.max(dp[i+1][1], -prices[i] + (i+2 <= n ? dp[i+2][0] : 0));
                    } else {
                        dp[i][buy] = Math.max(dp[i+1][0], prices[i] + dp[i+1][1]);
                    }
                }
            }
            return dp[0][1];
        }
    }`
    },


    {
      title: `QUESTION:
    You can do unlimited transactions but you have to pay transaction fee for each transaction.
    
    EXAMPLE:
    Input: prices = [1,3,2,8,4,9], fee = 2
    Output: 8`,
    
      bruteForceComplexity: `Time Complexity: Exponential`,
    
      bruteForceCode: `// Recursion with fee`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int maxProfit(int[] prices, int fee) {
            int n = prices.length;
            int[][] dp = new int[n+1][2];
            
            for (int i = n-1; i >= 0; i--) {
                for (int buy = 0; buy <= 1; buy++) {
                    if (buy == 1) {
                        dp[i][buy] = Math.max(dp[i+1][1], -prices[i] + dp[i+1][0]);
                    } else {
                        dp[i][buy] = Math.max(dp[i+1][0], prices[i] - fee + dp[i+1][1]);
                    }
                }
            }
            return dp[0][1];
        }
    }`
    }




  ]
  
  };
  
  export default questionsData;