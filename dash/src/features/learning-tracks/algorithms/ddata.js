 
const questionsData = {

"sorting-algorithm": [
    {
        title: `QUESTION:
    Given an array of integers nums.
    Sort the array in ascending order using Bubble Sort.

    EXAMPLE:
    Input:  nums = [5, 1, 4, 2, 8]
    Output: [1, 2, 4, 5, 8]
    Explanation: [5,1,4,2,8] -> [1,5,4,2,8] -> [1,4,5,2,8] -> [1,4,2,5,8] -> [1,2,4,5,8]`,

        bruteForceComplexity: ``,

        bruteForceCode: ``,

        optimalComplexity: `Time Complexity: O(N²) worst/average, O(N) best (with swapped flag)
    - Two nested loops; inner loop shrinks each pass, early exit if no swaps.

    Space Complexity: O(1)
    - Sorting is done in place.`,

        optimalCode: `Nested for loop till n-1(as after each treverse of sorting length decreases) then if(nums[j]>nums[j+1] swap i and j
        and mark swaped as true and outside of inner loop if(!swaped) break(as it make sures that array has sorted).


    class Solution {
        public int[] bubbleSort(int[] nums) {
            int n = nums.length;
            for (int i = 0; i < n - 1; i++) {          //Each pass places one largest unsorted element in its correct position, so after n - 1 passes, all elements are sorted and the last element is automatically in the correct position.
                boolean swapped = false;
                for (int j = 0; j < n - 1 - i; j++) {
                    if (nums[j] > nums[j + 1]) {
                        int temp = nums[j];
                        nums[j] = nums[j + 1];
                        nums[j + 1] = temp;
                        swapped = true;
                    }
                }
                if (!swapped) break;     //If no swaps occur in an entire pass, the array is already sorted, so we stop early to avoid unnecessary passes.
            }
            return nums;
        }
    }`
    },

    {
        title: `QUESTION:
    Given an array of integers nums.
    Sort the array in ascending order using Insertion Sort.

    EXAMPLE:
    Input:  nums = [9, 5, 1, 4, 3]
    Output: [1, 3, 4, 5, 9]
    Explanation: [9,5,1,4,3] -> [5,9,1,4,3] -> [1,5,9,4,3] -> [1,4,5,9,3] -> [1,3,4,5,9]`,

        bruteForceComplexity: ``,

        bruteForceCode: ``,

        optimalComplexity: `Time Complexity: O(N²) worst/average, O(N) best (already sorted)
    - Each element is compared/shifted against the sorted prefix.

    Space Complexity: O(1)
    - Sorting is done in place.`,

        optimalCode: `Here basically we start from index 1 and initialie j as(i-1) thwn in while(nums[j]>key) then put
         nums[j+1]=key and then j--(here it makes sure that every element is sorted before i index) when for loop ends
         and at last outside of while loop we put nums[j+1]=key as when we replace in while we did't assign any new
         no to j place so there will 2 same no so al last we make suretly of that.


    class Solution {
        public int[] insertionSort(int[] nums) {
            int n = nums.length;
            for (int i = 1; i < n; i++) {
                int key = nums[i];
                int j = i - 1;
                while (j >= 0 && nums[j] > key) {
                    nums[j + 1] = nums[j];
                    j--;
                }
                nums[j + 1] = key;
            }
            return nums;
        }
    }`
    },

    {
        title: `QUESTION:
    Given an array of integers nums.
    Sort the array in ascending order using Selection Sort.

    EXAMPLE:
    Input:  nums = [64, 25, 12, 22, 11]
    Output: [11, 12, 22, 25, 64]
    Explanation: [64,25,12,22,11] -> [11,25,12,22,64] -> [11,12,25,22,64] -> [11,12,22,25,64] -> [11,12,22,25,64]`,

        bruteForceComplexity: ``,

        bruteForceCode: ``,

        optimalComplexity: `Time Complexity: O(N²)
    - For each position, scan the remaining array to find the minimum.

    Space Complexity: O(1)
    - Sorting is done in place.`,

        optimalCode: `Here basically we use nested loop and in inner loop we find the min(the smallest element)
       and outside of inner loop we swap nums[i] and nums[minidx] and so on for the rest


    class Solution {
        public int[] selectionSort(int[] nums) {
            int n = nums.length;
            for (int i = 0; i < n - 1; i++) {
                int minIdx = i;
                for (int j = i + 1; j < n; j++) {
                    if (nums[j] < nums[minIdx]) {
                        minIdx = j;
                    }
                }
                int temp = nums[minIdx];
                nums[minIdx] = nums[i];
                nums[i] = temp;
            }
            return nums;
        }
    }`
    },

    {
        title: `QUESTION:
    Given an array of integers nums.
    Sort the array in ascending order using Merge Sort.

    EXAMPLE:
    Input:  nums = [38, 27, 43, 3, 9, 82, 10]
    Output: [3, 9, 10, 27, 38, 43, 82]
    Explanation: [38,27,43,3,9,82,10] -> [27,38,43] & [3,9,10,82] -> [3,9,10,27,38,43,82]`,

        bruteForceComplexity: ``,

        bruteForceCode: ``,

        optimalComplexity: `Time Complexity: O(N log N)
    - Array is divided in half log N times, each level takes O(N) to merge.

    Space Complexity: O(N)
    - Temporary arrays are used while merging.`,

        optimalCode: `divide array into halves recursively, then merge two sorted halves using a temp array


    class Solution {
        public int[] mergeSort(int[] nums) {
            if (nums.length <= 1) return nums;
            int mid = nums.length / 2;
            int[] left = mergeSort(Arrays.copyOfRange(nums, 0, mid));         //Take the right half of the array and recursively sort it.
            int[] right = mergeSort(Arrays.copyOfRange(nums, mid, nums.length));
            return merge(left, right);
        }

        private int[] merge(int[] left, int[] right) {
            int[] result = new int[left.length + right.length];
            int i = 0, j = 0, k = 0;
            while (i < left.length && j < right.length) {
                result[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
            }
            while (i < left.length) result[k++] = left[i++];
            while (j < right.length) result[k++] = right[j++];
            return result;
        }
    }`
    },

    {
        title: `QUESTION:
    Given an array of integers nums.
    Sort the array in ascending order using Quick Sort.

    EXAMPLE:
    Input:  nums = [10, 7, 8, 9, 1, 5]
    Output: [1, 5, 7, 8, 9, 10]
    Explanation: [10,7,8,9,1,5] -> [1,5,8,9,10,7] -> [1,5,7,9,10,8] -> [1,5,7,8,10,9] -> [1,5,7,8,9,10]`,

        bruteForceComplexity: ``,

        bruteForceCode: ``,

        optimalComplexity: `Time Complexity: O(N log N) average, O(N²) worst (bad pivot choices)
    - Partition around a pivot, then recursively sort each side.

    Space Complexity: O(log N) average
    - Recursion stack depth (in-place partitioning).`,

        optimalCode: `Quick Sort selects a pivot, partitions the array so smaller elements come before the pivot and larger
         elements after it, then recursively sorts both sides.


    class Solution {
        public int[] quickSort(int[] nums) {
            quickSortHelper(nums, 0, nums.length - 1);
            return nums;
        }

        private void quickSortHelper(int[] nums, int low, int high) {
            if (low < high) {
                int pi = partition(nums, low, high);
                quickSortHelper(nums, low, pi - 1);
                quickSortHelper(nums, pi + 1, high);
            }
        }

        private int partition(int[] nums, int low, int high) {
            int pivot = nums[high];
            int i = low - 1;
            for (int j = low; j < high; j++) {
                if (nums[j] < pivot) {
                    i++;
                    int temp = nums[i];
                    nums[i] = nums[j];
                    nums[j] = temp;
                }
            }
            int temp = nums[i + 1];
            nums[i + 1] = nums[high];
            nums[high] = temp;
            return i + 1;
        }
    }`
    }
    ],

  "arrays":[
    {
      title: `QUESTION:
    Given an array of integers nums and an integer target.
    Return the indices (0-indexed) of two elements in nums such that they add up to target.
    
    EXAMPLE:
    Input:  nums = [1, 6, 2, 10, 3]   target = 7
    Output: [0, 1]
    Explanation:  nums[0] + nums[1] = 1 + 6 = 7`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    - Two nested loops are used to check every possible pair.
    
    Space Complexity: O(1)
    - No extra data structure is used.`,
    
      bruteForceCode: `  nested for loop and take care of return new int[]{i,j}


      class Solution {
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
    
      optimalCode: `check is complement is present in map if then return new int[]{map.get(complement),i}
    

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
    
      optimalCode: `get count of each num in count array of length largest+1 -> for loop on count array-> while count[i]>0-> nums[i]=j
      BS  if num[mid] is 0 then swap num[low] and num[mid]-> else if 1 then mid++ ->  else swap num[high] and num[mid]
      
      class Solution {
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
    
      bruteForceCode: `nested for loop if nums[i]==nums[j] count++ and in outer loop if(count>n/2) return nums[i]
      
      
      class Solution {
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
    
      optimalCode: `
        class Solution {
            public int majorityElement(int[] nums) {
                HashMap<Integer, Integer> map = new HashMap<>();

                // Count frequencies
                for (int num : nums) {
                    map.put(num, map.getOrDefault(num, 0) + 1);
                }

                // Traverse keys
                int n = nums.length;
                for (int key : map.keySet()) {
                    if (map.get(key) > n / 2) {
                        return key;
                    }
                }


                // or this also 
                for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
                    if (entry.getValue() > n / 2) {
                        return entry.getKey();
                    }
                }

                return -1;
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
    
      bruteForceCode: `nested for loop sum+=nums[j] -> maxsum=max(maxsum,sum)
      

      class Solution {
        public int maxSubArray(int[] nums) {
            int maxSum = Integer.MIN_VALUE;
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                int sum = 0;
                for (int j = i; j < n; j++) {
                  maxSum = Math.max(maxSum, sum += nums[j]);
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
    
      bruteForceCode: `    maxProfit = Math.max(maxProfit, prices[j] - prices[i]);

      
      class Solution {
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
    
      optimalCode: ` if(price <minprice(initially(INF)))-> minprice=price   else Maxprofit=max(maxprofit, price-minprice)
      
      
      class Solution {
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
    
      bruteForceCode: `two arraylist(why-> get desired length) pos and neg store both types and then fu=inal array till n/2 res[2*i]=pos.get(0)
      
      
      class Solution {
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
    
      optimalCode: `if num[0]>0 res[posidx]=num then posidx+=2 else res[negidx]=num then negidx+=2
      
      
      class Solution {
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
    
      optimalCode: `Find i: scan from right, looking for where the sequence stops being non-increasing (i.e., find first nums[i] < nums[i+1] going backward).
      Find j and swap: find the smallest number right of i that's still bigger than nums[i]=2.        
      Reverse suffix after i: reverse everything from index i+1=2 to end.

      nums:  [1, 2, 4, 3]->  Before reverse: [1, 3, 4, 2]->  After reverse:  [1, 3, 2, 4]
      
      
      class Solution {
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
    
      bruteForceCode: `   nested for loop if nums[j]>nums[i]  isLeader=false -> break
      
      
      class Solution {
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
    
      optimalCode: `  if(nums[i]>maxRight)-> res.add(nums[i]) and maxRight=nums[i]
      
      
      class Solution {
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
    
      bruteForceCode: `   while(contains(nums, curr+1))-> curr++ and len++ -> maxlen=max(maxlen,len)
      
      
      class Solution {
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
    
      optimalCode: `put all num in set -> if (!set.contains(num - 1)) {  -> int current = num;  -> while (set.contains(current + 1)) {
      
      
      class Solution {
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
    
      bruteForceCode: `mark row and col with 0 one to-> (matrix[i][k] != 0) matrix[i][k] = -999; and again replace -999 with 0
      
      
      class Solution {
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
    
      optimalCode: `Use the first row and first column as marker arrays to remember which rows and columns should be
     set to zero, then update the matrix in a second pass.
      
      
      class Solution {
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
    
      bruteForceCode: `   temp[j][n - 1 - i] = matrix[i][j];
      
      
      class Solution {
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
    
      optimalCode: `transpose and then reverse each row->  matrix[i][j] = matrix[i][n-1-j];
      
      
      class Solution {
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
    
      bruteForceCode: `  nested loop->  if(sum==k) count++
      
      class Solution {
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
    
      optimalCode: ` use map and count += map.get(sum - k);
      
      class Solution {
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
    
      optimalCode: `Build the triangle row by row: put 1 at the beginning and end of every row, and compute every middle element
     as the sum of the two elements directly above it from the previous row.
      
      
      class Solution {
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
    
      bruteForceCode: ` 3 for loop ->  List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
      
      
      class Solution {
        public List<List<Integer>> threeSum(int[] nums) {
            List<List<Integer>> result = new ArrayList<>();
            int n = nums.length;
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    for (int k = j + 1; k < n; k++) {
                        if (nums[i] + nums[j] + nums[k] == 0) {
                            List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
                            triplet.sort(null);           //sorts the elements of the triplet->for integers, that means smallest to largest.
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
    
      bruteForceCode: `nested for lopp ->   if (sum == 0) { ->maxLength = Math.max(maxLength, j - i + 1);
      
      
      class Solution {
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
    
      optimalCode: `Map and  maxLength = Math.max(maxLength, i - prefixSum.get(sum));
      
      
      class Solution {
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
    
      bruteForceCode: `nested for loop and xor ^= nums[j]; -> if (xor == k) count++;
      
      class Solution {
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
    
      optimalCode: `   map and count += prefixXor.get(xor ^ k);
      
      
      class Solution {
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
            return result.toArray(new int[result.size()][]);  //Converts an ArrayList<int[]> into an int[][] by creating an array of the required type and copying all list elements into it.
        }
    }`
    },


    {
      title: `QUESTION:
    Given two sorted arrays arr1 and arr2 of size m and n respectively. Merge them in sorted order without using any extra space. Modify arr1 and arr2 so that arr1 contains the first m elements and arr2 contains the remaining elements.
    
    EXAMPLE:
    Input: arr1 = [1, 3, 5, 7], arr2 = [0, 2, 6, 8]
    Output: arr1 = [0, 1, 2, 3], arr2 = [5, 6, 7, 8]`,
    
      bruteForceComplexity: `Time Complexity: O((M+N) log(M+N))
    - Merge and sort.
    
    Space Complexity: O(M+N)`,
    
      bruteForceCode: `// Not allowed as per "without extra space"`,
    
      optimalComplexity: `Time Complexity: O(M + N)
    - Gap method (Shell sort inspired) or Two Pointers from end.
    
    Space Complexity: O(1)`,
    
      optimalCode: ` while (i >= 0 && j < m) {  it will shift desired no only
      
      
      class Solution {
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
    
      bruteForceCode: `nested for loop and if(arr[i] == arr[j]) -> find missing with help of visited in one for loop and return arr[i],k
      
      
      class Solution {
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
    
      optimalCode: ` put in map with counting freq and count = freq.getOrDefault(i, 0);-> if count=2 rep one and if 0 then missing one
      

        class Solution {
            public int[] findRepeatingMissing(int[] arr) {
                int n = arr.length;
                HashMap<Integer, Integer> freq = new HashMap<>();
                
                // Count frequency of each element
                for (int num : arr) {
                    freq.put(num, freq.getOrDefault(num, 0) + 1);
                }
                int repeating = -1, missing = -1;
                for (int i = 1; i <= n; i++) {
                    int count = freq.getOrDefault(i, 0);
                    if (count == 2) {
                        repeating = i;   // this number appeared twice
                    } else if (count == 0) {
                        missing = i;     // this number never appeared
                    }
                }
                return new int[]{repeating, missing};
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
    
      bruteForceCode: `nested for loop and  if (nums[i] > 2L * nums[j]) count++;
      
      class Solution {
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
    
      bruteForceCode: `   max = Math.max(max, prod *= nums[j]);


      class Solution {
        public int maxProduct(int[] nums) {
            int max = Integer.MIN_VALUE;
            for (int i = 0; i < nums.length; i++) {
                int prod = 1;
                for (int j = i; j < nums.length; j++) {
                    max = Math.max(max, prod *= nums[j]);
                }
            }
            return max;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `track maxp and minp and if num[i]<0 swap
      
      
      class Solution {
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
    
      bruteForceCode: `if(i*i>x) return (int)(i-1)
      
      
      class Solution {
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
    
      optimalCode: ` BS  if(mid*mid==x) return mid
      
      
      class Solution {
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
    - With speed 4:     -Pile 3: 1 hour     -Pile 6: 2 hours    -Pile 7: 2 hours    -Pile 11: 3 hours
    Total = 8 hours`,
    
      bruteForceComplexity: `Time Complexity: O(max(piles) * N)
    Space Complexity: O(1)`,
    
      bruteForceCode: `in these we will try for all values till high value of given and then call funtion that is this value ok or go for next
      
      
      class Solution {
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
                //or
                hours += (int) Math.ceil((double) p / speed);
            }
            return hours <= h;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log MaxPile)
    Space Complexity: O(1)`,
    
      optimalCode: `BS always low=1 and high=maxvalue then find mid then function call including mid if true high=mid else low=mid+1
      try to return that (high, low) in which u r updation in this low=mid+1 so return low
      
      class Solution {
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
               // arr[i] = i + 1(this logic is used) in place of i replace with mid 
                if (arr[mid] - mid - 1 < k) {    //  It calculates how many positive numbers are missing before arr[mid].
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
    //low numbers that exist in the array and k numbers that are missing.
            return low + k;   
        }
    }`
    },


    {
      title: `QUESTION:
    Given an array of stall positions and k cows, assign cows to stalls such that the minimum distance between any two cows is maximized. Return that maximum possible minimum distance.
    
    EXAMPLE:
    Input: stalls = [1,2,4,8,9], k = 3
    Output: 3
    Place cows at 1, 4, 8`,
    
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
                    sum = 0;
                }
                sum += pages;
            }
            return students <= m;
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
                count += Math.ceil((stations[i] - stations[i-1]) / dist) - 1;  //If a gap is divided into n pieces, you need n - 1 new stations.
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

  bruteForceCode: `nested for loop if(count>maxcout)-> maxcount=count and idx=i
  
  
  class Solution {
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

  optimalCode: `single loop and while (col >= 0 && mat[i][col] == 1) cl-- and int count = m - col - 1;
  
  
  class Solution {
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

  optimalCode: `here in BS we r considering 2D matrix as 1D and then searching cal row=mid/m  and col=mid%m
  
  
  class Solution {
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

  bruteForceCode: ` nested for loop if(num==target) return true
  
  
  class Solution {
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

  optimalCode: `while(row<nums.length && col>=0)
  
  class Solution {
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

  bruteForceCode: `nested for loop and initialize boolean ispeak= true and then apply all 4-dirn condn
  
  
  class Solution {
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

  optimalCode: `find mid and check in that colm which element is max and mark that colm and then check left and right of that element 
    if that curr elem < right then low=mid+1 means we will now move to that colm(right side one)
  
  class Solution {
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

  bruteForceCode: `put each element in an arraylist and then sort it and then return list.size()/2
  

  class Solution {
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

  optimalCode: `we find required(mediean element) then while loop and call function to count how may element less than mid
       in function also we r checking using BS only.
       Binary search on the value range and find the smallest value x such that the number of elements ≤ x is at least
       required = (n*m+1)/2; that value is the median.
  
  
  class Solution {
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
            
            List<Character>[] bucket = new List[s.length() + 1];   //why bucket length > s.length(s.length() + 1) ->We use the index itself as the frequency:
            for (char c : freq.keySet()) {
                int count = freq.get(c);
                if (bucket[count] == null) bucket[count] = new ArrayList<>();
                bucket[count].add(c);        //bucket[4] → null | bucket[3] → null | bucket[2] → [e] | bucket[1] → [t,r] | bucket[0] → null
            }
            
            StringBuilder sb = new StringBuilder();
            for (int i = bucket.length - 1; i >= 0; i--) {
                if (bucket[i] != null) {
                    for (char c : bucket[i]) {            //c = 'e'  when i=2
                        for (int j = 0; j < i; j++) sb.append(c);      //sb.append(e)  2 times
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
    Output: 58
    Subtraction rules(when we can subtract only)
    IV = 5 - 1 = 4
    IX = 10 - 1 = 9
    XL = 50 - 10 = 40
    XC = 100 - 10 = 90
    CD = 500 - 100 = 400
    CM = 1000 - 100 = 900`,
    
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
                int len1 = expandAroundCenter(s, i, i);     //Check odd-length palindrome  ex-aba
                int len2 = expandAroundCenter(s, i, i + 1);   //Check even-length palindrome  ex-aba
                int len = Math.max(len1, len2);
                if (len > end - start) {
                    start = i - (len - 1) / 2;     //Find the starting index of the palindrome.   ex-aba  here i=1  then start=0
                    end = i + len / 2;        //The ending index of the palindrome.    and end=2 with formula
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
    Output: 5  i=0 (0+0+1+1+1​) ​+ i=1 (0+0+0+1​​) + i=2 (0+0+1)​ ​+ i=3 (0+0) ​​+ i=4 (0)​​
     =3+1+1+0+0=5`,
    
      bruteForceComplexity: `Time Complexity: O(N³)
    Space Complexity: O(1)`,
    
      bruteForceCode: `// For each substring, count freq and compute beauty`,
    
      optimalComplexity: `Time Complexity: O(N²)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public int beautySum(String s) {
            int total = 0;
            int n = s.length();
            for (int i = 0; i < n; i++) {       // outer loop for getting all substring 
                int[] freq = new int[26];
                for (int j = i; j < n; j++) {     // 1st substring "aabcb"
                    freq[s.charAt(j) - 'a']++;            freq['a'-'a']=freq[0]=1
                    int maxF = 0, minF = Integer.MAX_VALUE;
                    for (int f : freq) {
                        if (f > 0) {
                            maxF = Math.max(maxF, f);           //maxF=1
                            minF = Math.min(minF, f);           //minF=1
                        }
                    }
                    total += (maxF - minF);          //total=0
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
    countAndSay(1) = "1"  read previous one that it
    countAndSay(2) = "11"     previous 11
    countAndSay(3) = "21"     previous 21
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
            sb.append(count).append(s.charAt(s.length()-1));   //sb('11')
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
    Output: Pattern found at index 10
    Index:    0 1 2 3 4 5 6 7 8
    Pattern:  A B A B C A B A B
    LPS:      0 0 1 2 0 1 2 3 4`,
    
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
        
        private int[] computeLPS(String pattern) {      //Longest Proper Prefix which is also Suffix
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
    Output: "aaacecaaa"
    Index:     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
    Character: a a c e c a a a # a  a  a  c  e  c  a  a
    LPS:       0 1 0 0 0 1 2 2 0 1  2  2  3  4  5  6  7`,
    
      bruteForceComplexity: `Time Complexity: O(N²)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Check all prefixes if palindrome`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public String shortestPalindrome(String s) {
            String rev = new StringBuilder(s).reverse().toString();  //rev="aaacecaa"
            String combined = s + "#" + rev;
            int[] lps = computeLPS(combined);
            int palinLen = lps[lps.length - 1];      //lps[17-1]=lps[16]=7
            return rev.substring(0, s.length() - palinLen) + s;   //rev.substring(0, 8-7) = "a"+"aacecaaa" = aaacecaaa
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
    Input: s = "ababab"
    Output: "abab"
    Index:    0 1 2 3 4 5
    String:   a b a b a b
    LPS:      0 0 1 2 3 4`,
    
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
    Given a singly linked list, insert a new node with value val at the beginning (start) of the list and return the new head.
    
    EXAMPLE:
    Input: list = 2 -> 3 -> 4, val = 1
    Output: 1 -> 2 -> 3 -> 4`,
    
        bruteForceComplexity: `Time Complexity: O(N) — copies all existing values into a new array, then rebuilds the entire list from scratch
    Space Complexity: O(N) for the temporary array/new nodes`,
    
        bruteForceCode: `class Solution {
        public ListNode insertAtStart(ListNode head, int val) {
            // copy all values into a list first
            List<Integer> values = new ArrayList<>();
            values.add(val);
            ListNode curr = head;
            while (curr != null) {
                values.add(curr.val);
                curr = curr.next;
            }
    
            // rebuild the entire linked list from scratch
            ListNode newHead = new ListNode(values.get(0));
            ListNode tail = newHead;
            for (int i = 1; i < values.size(); i++) {
                tail.next = new ListNode(values.get(i));
                tail = tail.next;
            }
            return newHead;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(1) — just create a node and point it to the old head
    Space Complexity: O(1) extra space besides the new node`,
    
        optimalCode: `class Solution {
        public ListNode insertAtStart(ListNode head, int val) {
            ListNode newNode = new ListNode(val);
            newNode.next = head; // point new node to old head
            return newNode;       // new node becomes the head
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given a singly linked list, insert a new node with value val at the end of the list and return the head.
    
    EXAMPLE:
    Input: list = 1 -> 2 -> 3, val = 4
    Output: 1 -> 2 -> 3 -> 4`,
    
        bruteForceComplexity: `Time Complexity: O(N) — copies all existing values into an array, then rebuilds the entire list including the new value
    Space Complexity: O(N) for the temporary array/new nodes`,
    
        bruteForceCode: `class Solution {
        public ListNode insertAtEnd(ListNode head, int val) {
            // copy all values into a list first
            List<Integer> values = new ArrayList<>();
            ListNode curr = head;
            while (curr != null) {
                values.add(curr.val);
                curr = curr.next;
            }
            values.add(val);
    
            // rebuild the entire linked list from scratch
            ListNode newHead = new ListNode(values.get(0));
            ListNode tail = newHead;
            for (int i = 1; i < values.size(); i++) {
                tail.next = new ListNode(values.get(i));
                tail = tail.next;
            }
            return newHead;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(N) — must traverse to the last node before attaching the new one (unavoidable without a tail pointer)
    Space Complexity: O(1) extra space besides the new node`,
    
        optimalCode: `class Solution {
        public ListNode insertAtEnd(ListNode head, int val) {
            ListNode newNode = new ListNode(val);
            if (head == null) return newNode; // empty list case
    
            ListNode curr = head;
            while (curr.next != null) { // walk to the last node
                curr = curr.next;
            }
            curr.next = newNode; // attach new node at the tail
            return head;
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given a singly linked list and a 0-indexed position, insert a new node with value val at that position (middle) in the list and return the head.
    
    EXAMPLE:
    Input: list = 1 -> 2 -> 4, val = 3, position = 2
    Output: 1 -> 2 -> 3 -> 4`,
    
        bruteForceComplexity: `Time Complexity: O(N) — copies all values into an array, inserts at the given index, then rebuilds the whole list
    Space Complexity: O(N) for the temporary array/new nodes`,
    
        bruteForceCode: `class Solution {
        public ListNode insertAtMiddle(ListNode head, int val, int position) {
            // copy all values into a list first
            List<Integer> values = new ArrayList<>();
            ListNode curr = head;
            while (curr != null) {
                values.add(curr.val);
                curr = curr.next;
            }
            values.add(position, val); // insert at the index using ArrayList's shift
    
            // rebuild the entire linked list from scratch
            ListNode newHead = new ListNode(values.get(0));
            ListNode tail = newHead;
            for (int i = 1; i < values.size(); i++) {
                tail.next = new ListNode(values.get(i));
                tail = tail.next;
            }
            return newHead;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(N) — must walk to the node just before the target position (unavoidable in a singly linked list)
    Space Complexity: O(1) extra space besides the new node`,
    
        optimalCode: `class Solution {
        public ListNode insertAtMiddle(ListNode head, int val, int position) {
            if (position == 0) {
                ListNode newNode = new ListNode(val);
                newNode.next = head;
                return newNode;
            }
    
            ListNode curr = head;
            for (int i = 0; i < position - 1; i++) { // stop just before the target position
                curr = curr.next;
            }
    
            ListNode newNode = new ListNode(val);
            newNode.next = curr.next; // link new node to the rest of the list
            curr.next = newNode;      // link previous node to the new node
            return head;
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given the head of a singly linked list and a value val, delete the first node that has that value and return the head.
    
    EXAMPLE:
    Input: list = 1 -> 2 -> 3 -> 4, val = 3
    Output: 1 -> 2 -> 4`,
    
        bruteForceComplexity: `Time Complexity: O(N) — copies all values except the target into an array, then rebuilds the entire list
    Space Complexity: O(N) for the temporary array/new nodes`,
    
        bruteForceCode: `class Solution {
        public ListNode deleteNode(ListNode head, int val) {
            // copy all values except the first occurrence of val
            List<Integer> values = new ArrayList<>();
            ListNode curr = head;
            boolean removed = false;
            while (curr != null) {
                if (!removed && curr.val == val) {
                    removed = true; // skip this one value only
                } else {
                    values.add(curr.val);
                }
                curr = curr.next;
            }
    
            // rebuild the entire linked list from scratch
            if (values.isEmpty()) return null;
            ListNode newHead = new ListNode(values.get(0));
            ListNode tail = newHead;
            for (int i = 1; i < values.size(); i++) {
                tail.next = new ListNode(values.get(i));
                tail = tail.next;
            }
            return newHead;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(N) — traverse until the target value is found, then relink pointers in place
    Space Complexity: O(1) extra space, no new nodes created`,
    
        optimalCode: `class Solution {
        public ListNode deleteNode(ListNode head, int val) {
            if (head == null) return null;
            if (head.val == val) return head.next; // deleting the head itself
    
            ListNode prev = head;
            ListNode curr = head.next;
            while (curr != null) {
                if (curr.val == val) {
                    prev.next = curr.next; // unlink curr by skipping over it
                    return head;
                }
                prev = curr;
                curr = curr.next;
            }
            return head; // value not found, list unchanged


            // or this way also
            if (head == null) return null;
            if (head.val == val)
                return head.next;
            ListNode curr = head;
            while (curr.next != null && curr.next.val != val) {
                curr = curr.next;
            }
            if (curr.next != null) {
                curr.next = curr.next.next;
            }
            return head;
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given the head of a singly linked list, reverse the list and return the new head.
    
    EXAMPLE:
    Input: list = 1 -> 2 -> 3 -> 4 -> 5
    Output: 5 -> 4 -> 3 -> 2 -> 1`,
    
        bruteForceComplexity: `Time Complexity: O(N) — copies all values into an array, reverses the array, then rebuilds the entire list
    Space Complexity: O(N) for the temporary array/new nodes`,
    
        bruteForceCode: `class Solution {
        public ListNode reverseList(ListNode head) {
            // copy all values into a list first
            List<Integer> values = new ArrayList<>();
            ListNode curr = head;
            while (curr != null) {
                values.add(curr.val);
                curr = curr.next;
            }
            Collections.reverse(values); // reverse using extra space
    
            // rebuild the entire linked list from scratch
            if (values.isEmpty()) return null;
            ListNode newHead = new ListNode(values.get(0));
            ListNode tail = newHead;
            for (int i = 1; i < values.size(); i++) {
                tail.next = new ListNode(values.get(i));
                tail = tail.next;
            }
            return newHead;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(N) — single pass, reversing each pointer in place
    Space Complexity: O(1) extra space, no new nodes created`,
    
        optimalCode: `class Solution {
        public ListNode reverseList(ListNode head) {
            ListNode prev = null;
            ListNode curr = head;
    
            while (curr != null) {
                ListNode nextTemp = curr.next; // save next node before overwriting
                curr.next = prev;              // reverse the pointer
                prev = curr;                   // move prev forward
                curr = nextTemp;               // move curr forward
            }
            return prev; // prev is the new head after full reversal
        }
    }`
    },

    {
      title: `QUESTION:
    Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.
    
    EXAMPLE:
    Input: head = [1,2,3,4,5]
    Output: [3,4,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N) + O(N/2) — two passes
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public ListNode middleNode(ListNode head) {
            int count = 0;
            ListNode temp = head;
            while (temp != null) { // first pass: count nodes
                count++;
                temp = temp.next;
            }
    
            int steps = count / 2;
            temp = head;
            for (int i = 0; i < steps; i++) { // second pass: walk to middle
                temp = temp.next;
            }
            return temp;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N) — single pass
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public ListNode middleNode(ListNode head) {
            ListNode slow = head, fast = head;
            // fast moves 2 steps, slow moves 1 step -> slow lands on middle
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
            }
                // in question is asks to return head means we r returning whole updated ll got it na
            return slow; // in ll when we return a node(it means it will return all nodes after that including that node also)
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the head of a singly linked list, reverse the list, and return the reversed list.
    
    EXAMPLE:
    Input: head = [1,2,3,4,5]
    Output: [5,4,3,2,1]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — uses extra array/stack`,
    
      bruteForceCode: `class Solution {
        public ListNode reverseList(ListNode head) {
            List<Integer> values = new ArrayList<>();
            ListNode temp = head;
            while (temp != null) { // store all values
                values.add(temp.val);
                temp = temp.next;
            }
    
            temp = head;
            for (int i = values.size() - 1; i >= 0; i--) { // overwrite in reverse order
                temp.val = values.get(i);
                temp = temp.next;
            }
            return head;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `class Solution {
        public ListNode reverseList(ListNode head) {
            ListNode prev = null, curr = head;
            while (curr != null) {
                ListNode nextTemp = curr.next; // save next
                curr.next = prev;              // reverse pointer
                prev = curr;                   // advance prev
                curr = nextTemp;               // advance curr
            }
            return prev; // new head
        }
    }`
    },

    {
      title: `QUESTION:
  Given a singly linked list, remove the last node of the list and return the head.
   
  EXAMPLE:
  Input: list = 1 -> 2 -> 3 -> 4
  Output: 1 -> 2 -> 3`,
   
      bruteForceComplexity: `Time Complexity: O(N) — copies all values except the last into an array, then rebuilds the list
  Space Complexity: O(N) for the temporary array/new nodes`,
   
      bruteForceCode: `class Solution {
      public ListNode removeLast(ListNode head) {
          // copy all values except the last into a list
          List<Integer> values = new ArrayList<>();
          ListNode curr = head;
          while (curr != null && curr.next != null) {
              values.add(curr.val);
              curr = curr.next;
          }
          if (values.isEmpty()) return null; // 0 or 1 node list
   
          // rebuild the list from scratch
          ListNode newHead = new ListNode(values.get(0));
          ListNode tail = newHead;
          for (int i = 1; i < values.size(); i++) {
              tail.next = new ListNode(values.get(i));
              tail = tail.next;
          }
          return newHead;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — must walk to the second-last node to unlink the last one
  Space Complexity: O(1) extra space`,
   
      optimalCode: `class Solution {
      public ListNode removeLast(ListNode head) {
          if (head == null || head.next == null) return null; // 0 or 1 node
   
          ListNode curr = head;
          while (curr.next.next != null) { // stop at second-last node
              curr = curr.next;
          }
          curr.next = null; // drop the last node
          return head;
      }
  }`
    },
   
    {
      title: `QUESTION:
  Given a singly linked list and a target value, search the list and return true if the value exists, false otherwise.
   
  EXAMPLE:
  Input: list = 1 -> 2 -> 3 -> 4, target = 3
  Output: true`,
   
      bruteForceComplexity: `Time Complexity: O(N) — copies all values into an array, then scans the array
  Space Complexity: O(N) for the temporary array`,
   
      bruteForceCode: `class Solution {
      public boolean search(ListNode head, int target) {
          // copy all values into a list first
          List<Integer> values = new ArrayList<>();
          ListNode curr = head;
          while (curr != null) {
              values.add(curr.val);
              curr = curr.next;
          }
   
          // scan the copied array
          for (int v : values) {
              if (v == target) return true;
          }
          return false;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — single traversal of the list, no extra copy needed
  Space Complexity: O(1) extra space`,
   
      optimalCode: `class Solution {
      public boolean search(ListNode head, int target) {
          ListNode curr = head;
          while (curr != null) { // walk the list once
              if (curr.val == target) return true;
              curr = curr.next;
          }
          return false;
      }
  }`
    },
   
    {
      title: `QUESTION:
  Given a singly linked list, find and remove the nth node from the end of the list, then return the head.
   
  EXAMPLE:
  Input: list = 1 -> 2 -> 3 -> 4 -> 5, n = 2
  Output: 1 -> 2 -> 3 -> 5`,
   
      bruteForceComplexity: `Time Complexity: O(N) — one pass to count total nodes, another pass to reach and remove the target node
  Space Complexity: O(1) extra space (no copy needed, but conceptually two passes)`,
   
      bruteForceCode: `class Solution {
      public ListNode removeNthFromEnd(ListNode head, int n) {
          // first pass: count total nodes
          int length = 0;
          ListNode curr = head;
          while (curr != null) {
              length++;
              curr = curr.next;
          }
   
          // position from the start of the node to remove
          int posFromStart = length - n;
          if (posFromStart == 0) return head.next; // removing the head
   
          // second pass: walk to the node just before the target
          curr = head;
          for (int i = 0; i < posFromStart - 1; i++) {
              curr = curr.next;
          }
          curr.next = curr.next.next; // unlink target node
          return head;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — single pass using two pointers kept n apart
  Space Complexity: O(1) extra space`,
   
      optimalCode: `class Solution {
      public ListNode removeNthFromEnd(ListNode head, int n) {
          ListNode dummy = new ListNode(0);
          dummy.next = head;
          ListNode fast = dummy, slow = dummy;
   
          for (int i = 0; i < n; i++) { // move fast n steps ahead
              fast = fast.next;
          }
   
          while (fast.next != null) { // move both until fast hits the end
              fast = fast.next;
              slow = slow.next;
          }
   
          slow.next = slow.next.next; // unlink the nth node from end
          return dummy.next;

          // or this way also
                int length = 0;
                ListNode temp = head;
                while (temp != null) {
                    length++;
                    temp = temp.next;
                }
                if (length == n) {    //If n = 5, then we have to remove the 5th node from the end.
                    return head.next;
                }
                temp = head;
                for (int i = 1; i < length - n; i++) {
                    temp = temp.next;
                }
                temp.next = temp.next.next;
                return head;
      }
  }`
    },
   
  
    {
      title: `QUESTION:
  Given a singly linked list, determine whether it contains a cycle (a node's next pointer eventually loops back to a previous node).
   
  EXAMPLE:
  Input: list = 1 -> 2 -> 3 -> 4 -> (points back to 2)
  Output: true`,
   
      bruteForceComplexity: `Time Complexity: O(N) — visits each node once and stores it in a hash set to check for repeats
  Space Complexity: O(N) for the hash set`,
   
      bruteForceCode: `class Solution {
      public boolean hasCycle(ListNode head) {
          Set<ListNode> visited = new HashSet<>();
          ListNode curr = head;
          while (curr != null) {
              if (visited.contains(curr)) return true; // seen this node before
              visited.add(curr);
              curr = curr.next;
          }
          return false;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — Floyd's slow/fast pointer technique, fast catches slow if a cycle exists
  Space Complexity: O(1) extra space`,
   
      optimalCode: `class Solution {
      public boolean hasCycle(ListNode head) {
          ListNode slow = head, fast = head;
   
          while (fast != null && fast.next != null) {
              slow = slow.next;         // moves 1 step
              fast = fast.next.next;    // moves 2 steps
              if (slow == fast) return true; // pointers met, cycle exists
          }
          return false; // fast reached the end, no cycle
      }
  }`
    },
   
    {
      title: `QUESTION:
  Given a singly linked list that may contain a cycle, remove the cycle (if one exists) so the list ends in null, and return the head.
   
  EXAMPLE:
  Input: list = 1 -> 2 -> 3 -> 4 -> (points back to 2)
  Output: 1 -> 2 -> 3 -> 4 -> null`,
   
      bruteForceComplexity: `Time Complexity: O(N) — stores visited nodes in a hash set, unlinks as soon as a repeat is found
  Space Complexity: O(N) for the hash set`,
   
      bruteForceCode: `class Solution {
      public ListNode removeCycle(ListNode head) {
          Set<ListNode> visited = new HashSet<>();
          ListNode curr = head, prev = null;
   
          while (curr != null) {
              if (visited.contains(curr)) {
                  prev.next = null; // cut the link that creates the cycle
                  return head;
              }
              visited.add(curr);
              prev = curr;
              curr = curr.next;
          }
          return head; // no cycle found
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — Floyd's algorithm to detect meeting point, then find and cut the cycle start
  Space Complexity: O(1) extra space`,
   
      optimalCode: `class Solution {
      public ListNode removeCycle(ListNode head) {
          if (head == null || head.next == null) return head;
   
          ListNode slow = head, fast = head;
          boolean hasCycle = false;
   
          // step 1: detect if a cycle exists
          while (fast != null && fast.next != null) {
              slow = slow.next;
              fast = fast.next.next;
              if (slow == fast) {
                  hasCycle = true;
                  break;
              }
          }
          if (!hasCycle) return head;
   
          // step 2: find the start of the cycle
          slow = head;
          if (slow == fast) { // cycle starts at head
              while (fast.next != slow) {
                  fast = fast.next;
              }
          } else {
              while (slow.next != fast.next) {
                  slow = slow.next;
                  fast = fast.next;
              }
          }
   
          fast.next = null; // cut the cycle
          return head;
      }
  }`
    },
   
    {
      title: `QUESTION:
  Given a singly linked list, sort it in ascending order using merge sort and return the head.
   
  EXAMPLE:
  Input: list = 4 -> 2 -> 1 -> 3
  Output: 1 -> 2 -> 3 -> 4`,
   
      bruteForceComplexity: `Time Complexity: O(N log N) for sorting, but O(N) extra work — copies values into an array, sorts, then rebuilds the list
  Space Complexity: O(N) for the temporary array/new nodes`,
   
      bruteForceCode: `class Solution {
      public ListNode sortList(ListNode head) {
          // copy all values into a list
          List<Integer> values = new ArrayList<>();
          ListNode curr = head;
          while (curr != null) {
              values.add(curr.val);
              curr = curr.next;
          }
   
          Collections.sort(values); // sort using built-in sort
   
          // rebuild the list from sorted values
          ListNode newHead = new ListNode(values.get(0));
          ListNode tail = newHead;
          for (int i = 1; i < values.size(); i++) {
              tail.next = new ListNode(values.get(i));
              tail = tail.next;
          }
          return newHead;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N log N) — classic merge sort adapted to linked lists using slow/fast split
  Space Complexity: O(log N) recursion stack, O(1) extra node space (in-place merging)`,
   
      optimalCode: `class Solution {
      public ListNode sortList(ListNode head) {
          if (head == null || head.next == null) return head;
   
          // split the list into two halves
          ListNode mid = getMid(head);
          ListNode left = head;
          ListNode right = mid.next;
          mid.next = null;
   
          // recursively sort each half
          left = sortList(left);
          right = sortList(right);
   
          return merge(left, right); // merge sorted halves
      }
   
      private ListNode getMid(ListNode head) {
          ListNode slow = head, fast = head.next;
          while (fast != null && fast.next != null) {
              slow = slow.next;
              fast = fast.next.next;
          }
          return slow;
      }
   
      private ListNode merge(ListNode l1, ListNode l2) {
          ListNode dummy = new ListNode(0);
          ListNode tail = dummy;
   
          while (l1 != null && l2 != null) {
              if (l1.val <= l2.val) {
                  tail.next = l1;
                  l1 = l1.next;
              } else {
                  tail.next = l2;
                  l2 = l2.next;
              }
              tail = tail.next;
          }
          tail.next = (l1 != null) ? l1 : l2; // attach remaining nodes
          return dummy.next;
      }
  }`
    },
   
    {
      title: `QUESTION:
  Given a singly linked list, reorder it in a zig-zag pattern: first node, last node, second node, second-to-last node, and so on.
   
  EXAMPLE:
  Input: list = 1 -> 2 -> 3 -> 4 -> 5
  Output: 1 -> 5 -> 2 -> 4 -> 3`,
   
      bruteForceComplexity: `Time Complexity: O(N) — copies all values into an array, then rebuilds the list by picking alternately from front and back
  Space Complexity: O(N) for the temporary array/new nodes`,
   
      bruteForceCode: `class Solution {
      public ListNode zigZag(ListNode head) {
          // copy all values into a list
          List<Integer> values = new ArrayList<>();
          ListNode curr = head;
          while (curr != null) {
              values.add(curr.val);
              curr = curr.next;
          }
   
          // rebuild by alternating front and back picks
          ListNode dummy = new ListNode(0);
          ListNode tail = dummy;
          int left = 0, right = values.size() - 1;
          boolean fromLeft = true;
   
          while (left <= right) {
              int val = fromLeft ? values.get(left++) : values.get(right--);
              tail.next = new ListNode(val);
              tail = tail.next;
              fromLeft = !fromLeft;
          }
          return dummy.next;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — find middle, reverse second half, then interleave the two halves in place
  Space Complexity: O(1) extra space`,
   
      optimalCode: `Here we r doing same as palindrome one(same logic of firsthalf and secondhalf) and the storing one 
      and one element of each in dummy ll
      
      
      class Solution {
      public ListNode zigZag(ListNode head) {
          if (head == null || head.next == null) return head;
   
          // find the middle using slow/fast pointers
          ListNode slow = head, fast = head;
          while (fast.next != null && fast.next.next != null) {
              slow = slow.next;
              fast = fast.next.next;
          }
   
          // split and reverse the second half
          ListNode secondHalf = reverse(slow.next);
          slow.next = null;
          ListNode firstHalf = head;
   
          // interleave first half and reversed second half
          ListNode dummy = new ListNode(0);
          ListNode tail = dummy;
          while (firstHalf != null || secondHalf != null) {
              if (firstHalf != null) {
                  tail.next = firstHalf;
                  firstHalf = firstHalf.next;
                  tail = tail.next;
              }
              if (secondHalf != null) {
                  tail.next = secondHalf;
                  secondHalf = secondHalf.next;
                  tail = tail.next;
              }
          }
          return dummy.next;
      }
   
      private ListNode reverse(ListNode head) {
          ListNode prev = null;
          while (head != null) {
              ListNode next = head.next;
              head.next = prev;
              prev = head;
              head = next;
          }
          return prev;
      }
  }`
    },
   
    {
      title: `QUESTION:
  Given the head of a doubly linked list, reverse the list in place and return the new head.
   
  EXAMPLE:
  Input: list = 1 <-> 2 <-> 3 <-> 4
  Output: 4 <-> 3 <-> 2 <-> 1`,
   
      bruteForceComplexity: `Time Complexity: O(N) — copies all values into an array, then rebuilds a brand new doubly linked list in reverse order
  Space Complexity: O(N) for the temporary array/new nodes`,
   
      bruteForceCode: `class Solution {
      public Node reverseDLL(Node head) {
          // copy all values into a list first
          List<Integer> values = new ArrayList<>();
          Node curr = head;
          while (curr != null) {
              values.add(curr.val);
              curr = curr.next;
          }
   
          // rebuild a new DLL in reverse order
          Node newHead = new Node(values.get(values.size() - 1));
          Node tail = newHead;
          for (int i = values.size() - 2; i >= 0; i--) {
              Node node = new Node(values.get(i));
              tail.next = node;
              node.prev = tail;
              tail = node;
          }
          return newHead;
      }
  }`,
   
      optimalComplexity: `Time Complexity: O(N) — single traversal swapping next/prev pointers at each node
  Space Complexity: O(1) extra space`,
   
      optimalCode: `class Solution {
      public Node reverseDLL(Node head) {
          Node curr = head;
          Node newHead = head;
   
          while (curr != null) {
              Node temp = curr.prev;   // swap prev and next
              curr.prev = curr.next;
              curr.next = temp;
   
              newHead = curr;          // track the last visited node as new head
              curr = curr.prev;        // move to next node (old next, now prev)
          }
          return newHead;
      }
  }`
    },
    
    {
      title: `QUESTION:
    You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return the head of the merged list.
    
    EXAMPLE:
    Input: list1 = [1,2,4], list2 = [1,3,4]
    Output: [1,1,2,3,4,4]`,
    
      bruteForceComplexity: `Time Complexity: O((N+M) log(N+M)) — collect all values, then sort
    Space Complexity: O(N+M)`,
    
      bruteForceCode: `class Solution {
        public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
            List<Integer> values = new ArrayList<>();
            while (list1 != null) { values.add(list1.val); list1 = list1.next; }
            while (list2 != null) { values.add(list2.val); list2 = list2.next; }
    
            Collections.sort(values); // ignores the fact both lists are already sorted
    
            ListNode dummy = new ListNode(-1);
            ListNode curr = dummy;
            for (int val : values) {
                curr.next = new ListNode(val);
                curr = curr.next;
            }
            return dummy.next;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N+M)
    Space Complexity: O(1) — reuses existing nodes`,
    
      optimalCode: `class Solution {
        public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
            ListNode dummy = new ListNode(-1);
            ListNode curr = dummy;
    
            while (list1 != null && list2 != null) {
                if (list1.val <= list2.val) {
                    curr.next = list1;
                    list1 = list1.next;
                } else {
                    curr.next = list2;
                    list2 = list2.next;
                }
                curr = curr.next;
            }
            // attach whichever list remains
            curr.next = (list1 != null) ? list1 : list2;
    
            return dummy.next;
        }
    }`
    },
    

    {
      title: `QUESTION:
    Given the head of a singly linked list, determine if the linked list is a palindrome.
    
    EXAMPLE:
    Input: head = [1,2,2,1]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — stores all values in a list`,
    
      bruteForceCode: `class Solution {
        public boolean isPalindrome(ListNode head) {
            List<Integer> values = new ArrayList<>();
            ListNode temp = head;
            while (temp != null) { // copy all values
                values.add(temp.val);
                temp = temp.next;
            }
    
            int left = 0, right = values.size() - 1;
            while (left < right) {
                if (!values.get(left).equals(values.get(right))) return false;
                left++;
                right--;
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `Here 1st we r using slow and fast approach to reach mid and after that we r reversing the whole from slow next considering as 
      secondhalf and after reversing we r macthing from starting(head) to reversed secondhalf and at last we r reversing the second
      half again too restore it again
      
      
      class Solution {
        public boolean isPalindrome(ListNode head) {
            if (head == null || head.next == null) return true;
    
            // find middle using slow/fast pointers
            ListNode slow = head, fast = head;
            while (fast.next != null && fast.next.next != null) {
                slow = slow.next;
                fast = fast.next.next;
            }
    
            // reverse second half in-place
            ListNode secondHalf = reverse(slow.next);
            ListNode firstHalf = head;
    
            // compare both halves
            ListNode temp = secondHalf;
            boolean result = true;
            while (temp != null) {
                if (firstHalf.val != temp.val) {
                    result = false;
                    break;
                }
                firstHalf = firstHalf.next;
                temp = temp.next;
            }
    
            slow.next = reverse(secondHalf); // restore original list (optional)
            return result;
        }
    
        private ListNode reverse(ListNode head) {
            ListNode prev = null, curr = head;
            while (curr != null) {
                ListNode next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }
            return prev;
        }
    }`
    },
    
    
    {
      title: `QUESTION:
    Given the head of a singly linked list and two integers left and right, reverse the nodes of the list from position left to position right, and return the reversed list.
    
    EXAMPLE:
    Input: head = [1,2,3,4,5], left = 2, right = 4
    Output: [1,4,3,2,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — stores values in a list to reverse the segment`,
    
      bruteForceCode: `class Solution {
        public ListNode reverseBetween(ListNode head, int left, int right) {
            List<Integer> values = new ArrayList<>();
            ListNode temp = head;
            while (temp != null) { // copy all values
                values.add(temp.val);
                temp = temp.next;
            }
    
            // reverse the sublist [left-1, right-1] in the array
            int i = left - 1, j = right - 1;
            while (i < j) {
                int t = values.get(i);
                values.set(i, values.get(j));
                values.set(j, t);
                i++;
                j--;
            }
    
            temp = head;
            for (int val : values) { // overwrite list with modified values
                temp.val = val;
                temp = temp.next;
            }
            return head;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `here 1st we r reaching and left position of question and then traversing for len right-left that it 
      
      
      class Solution {
        public ListNode reverseBetween(ListNode head, int left, int right) {
            if (head == null || left == right) return head;
    
            ListNode dummy = new ListNode(-1);
            dummy.next = head;
            ListNode prev = dummy;
    
            for (int i = 0; i < left - 1; i++) prev = prev.next; // node before left
    
            ListNode curr = prev.next;   //  2
            // reverse in-place using pointer manipulation, no extra storage
            for (int i = 0; i < right - left; i++) {
                ListNode nextNode = curr.next;   //  3
                curr.next = nextNode.next;     // 2 ->4
                nextNode.next = prev.next;     // 3 -> 2
                prev.next = nextNode;          // 1 -> 3  (1 → 3 → 2 → 4 → 5)
            }
    
            return dummy.next;


            // or this way also
                if (head == null || left == right)
                    return head;

                ListNode dummy = new ListNode(0);
                dummy.next = head;

                ListNode prev = dummy;

                // Move prev before left
                for (int i = 1; i < left; i++)
                    prev = prev.next;

                ListNode start = prev.next;
                ListNode curr = start;
                ListNode prevNode = null;

                // Reverse right-left+1 nodes
                for (int i = 0; i <= right - left; i++) {
                    ListNode next = curr.next;
                    curr.next = prevNode;
                    prevNode = curr;
                    curr = next;
                }

                // Reconnect
                prev.next = prevNode;
                start.next = curr;

                return dummy.next;
        }
    }`
    },
    
    {
      title: `QUESTION:
    You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.
    
    EXAMPLE:
    Input: l1 = [2,4,3], l2 = [5,6,4]
    Output: [7,0,8]  (342 + 465 = 807)`,
    
      bruteForceComplexity: `Time Complexity: O(N+M)
    Space Complexity: O(N+M) — converts lists to numbers via strings/BigInteger`,
    
      bruteForceCode: `class Solution {
        public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
            StringBuilder s1 = new StringBuilder();
            while (l1 != null) { s1.append(l1.val); l1 = l1.next; } // digits are reversed already, so prepend won't match order
    
            StringBuilder s2 = new StringBuilder();
            while (l2 != null) { s2.append(l2.val); l2 = l2.next; }
    
            // reverse strings to get actual number, since input was stored in reverse
            BigInteger num1 = new BigInteger(s1.reverse().toString());
            BigInteger num2 = new BigInteger(s2.reverse().toString());
            String sum = num1.add(num2).toString();
    
            // build result list in reverse order of sum
            ListNode dummy = new ListNode(-1);
            ListNode curr = dummy;
            for (int i = sum.length() - 1; i >= 0; i--) {
                curr.next = new ListNode(sum.charAt(i) - '0');
                curr = curr.next;
            }
            return dummy.next;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(max(N,M))
    Space Complexity: O(max(N,M)) for the output list`,
    
      optimalCode: `Here we r adding normally as we do on copy and calculating carry as we do normally and storing ans in dummy using sum%10
      
      
      class Solution {
        public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
            ListNode dummy = new ListNode(-1);
            ListNode curr = dummy;
            int carry = 0;
    
            while (l1 != null || l2 != null || carry != 0) {
                int sum = carry;
                if (l1 != null) { sum += l1.val; l1 = l1.next; }
                if (l2 != null) { sum += l2.val; l2 = l2.next; }
    
                carry = sum / 10;
                curr.next = new ListNode(sum % 10);
                curr = curr.next;
            }
            return dummy.next;
        }
    }`
    },


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
    
      optimalCode: `simply traversing to every node and if curr and curr next r same then point curr to next to next
      
      
      class Solution {
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
    
      optimalCode: `here basically we r reversing every k nodes(means 1st k nodes then again the next k nodes this way) after reversing every k 
      nodes we r making prev as the end of revesrsed node and again doing for the next and is done using while(count>=k)
      
      
class Solution {
    public Node reverseKGroup(Node head, int k) {
        if (head == null || k == 1) return head;

        Node dummy = new Node(0);
        dummy.next = head;                  // dummy -> 1 -> 2 -> 3 -> 4 -> 5
        Node prev = dummy;                  // prev = dummy
        Node curr = head;
        Node next = null;

        int count = 0;
        while (curr != null) {
            count++;
            curr = curr.next;
        }
        // count = 5

        while (count >= k) {                // 5 >= 2 → enter loop

            curr = prev.next;               // curr = 1              [prev=dummy, curr=1]
            next = curr.next;                // next = 2              [next=2]

            for (int i = 1; i < k; i++) {    // i=1 (runs once since k=2)

                curr.next = next.next;       // 1.next = 3            → dummy -> 1 -> 3 -> 4 -> 5   (2 detached)
                next.next = prev.next;       // 2.next = 1             → 2 -> 1 -> 3 -> 4 -> 5
                prev.next = next;            // dummy.next = 2         → dummy -> 2 -> 1 -> 3 -> 4 -> 5
                next = curr.next;            // next = 1.next = 3

            }
            // for loop ends (i=2 fails i<k)

            prev = curr;                     // prev = 1              (tail of reversed group)
            count -= k;                       // count = 5-2 = 3

            // ---- state after iteration 1 ----
            // List: dummy -> 2 -> 1 -> 3 -> 4 -> 5
            // prev is at node 1, ready for next group [3,4]
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
    
      optimalCode: `here we r finding the length of ll and then traversing till that point from where we want to rotate the ll with(len-k) 
      and after this we r making that points next to newhead(means to 4 in above ex) and making that point tp point null and
       tail next to head(means 5 to 1) that it
      
      
      class Solution {
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
    
      optimalCode: `basically here we just need to point child of each node to next of parent that it and children can also have
       child and in question it is asking for sort it doesnt mean sort numbers numerically
      
      class Solution {
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
    Output: Deep copy of the list
    7  -> 7'  -> 13 -> 13' -> 11 -> 11' -> 10 -> 10' -> 1 -> 1' -> null`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `// Using HashMap`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `1st make copies of given and then assign random pointer to the copied ones(same as original one but assign the copied one)
       and then keep everything of copied and remove the original ones
      
      
      class Solution {
        public Node copyRandomList(Node head) {
            if (head == null) return null;
            
            // Step 1: Insert copy nodes
            Node curr = head;              //7
            while (curr != null) {
                Node copy = new Node(curr.val);   //7'
                copy.next = curr.next;            //7'.next = 13
                curr.next = copy;                 //7.next = 7'
                curr = copy.next;                 //13
            }
            
            // Step 2: Set random pointers
            curr = head;
            while (curr != null) {
                if (curr.random != null) {
                    curr.next.random = curr.random.next;       //13.next = 13'-> 13'.random = ?  ->>> 13.random=7 -> 13.random.next=7'
                }
                curr = curr.next.next;
            }
            
            // Step 3: Separate original and copy list
            Node dummy = new Node(0);
            Node copyCurr = dummy;
            curr = head;                      //7
            
            while (curr != null) {
                copyCurr.next = curr.next;     //7'  (copyCurr.next = 7')
                copyCurr = copyCurr.next;      //7'
                curr.next = curr.next.next;    //7.next = 13
                curr = curr.next;              //13
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
    //If n is a power of 2, it has only one 1 in binary, and n-1 makes that 1 become 0, so n & (n-1) = 0.
    Check if power of 2
    bool isPowerOf2 = (n > 0) && (n & (n-1)) == 0;
    
    // Count set bits (Brian Kernighan) ->  no. of 1 in binary representation of n
    int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n = n & (n-1);
            count++;
        }
        return count;
    }
    
    // Get ith bit
    //1 << i puts 1 at position i, and n & (1 << i) checks whether n has 1 at that position.
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
    //1 << i creates 1 at position i, and XOR with 1 toggles that bit: 0 → 1 and 1 → 0.
    int toggleBit(int n, int i) {
        return n ^ (1 << i);
    }
    
    // Swap two numbers without temp
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    
    // Find missing number in 1 to n
    arr = [1, 2, 4]
    n = 4  ans=missing=3
    Basically ye sab XOR ho raha hai:  0 ^ 1 ^ 2 ^ 4 ^ 1 ^ 2 ^ 3 ^ 4
    Ab same numbers ko pair bana do:   (1 ^ 1) ^ (2 ^ 2) ^ (4 ^ 4) ^ 3
    Same numbers cancel:  0 ^ 0 ^ 0 ^ 3
    int missing = 0;
    for (int num : arr) missing ^= num;
    for (int i = 1; i <= n; i++) missing ^= i;
    
    // Single Number I (appears once, others twice)
    int single = 0;
    for (int num : nums) single ^= num;
    
    // Single Number II (appears once, others thrice)
    ones stores numbers seen once, twos stores numbers seen twice, and on the 3rd time the number is removed from both.
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
    
      bruteForceCode: `here basically we r taking xor of start and goal and after that we r counting that how many 1's r there 
      in resultant xor with th help of count += xor & 1;   as if we take & of any no with 1 then it will result 1 if last digit 
      of resultant is 1 and after that we shift that last digit of resultant with xor >>= 1; and hence calculating all 1's
      
      
      class Solution {
        public int minBitFlips(int start, int goal) {
            int xor = start ^ goal;        //  1010 ^ 0111= 1101 ->13  (3 diff bits)
            int count = 0;
            while (xor > 0) {
                count += xor & 1;          //  1101 & 0001=0001 -> count=1
                xor >>= 1;             //  1101 >> 1=0110
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
    
      optimalCode: `see if we do ans^=num then it will return the element whcih will be single, see how we r initialize ans as 0 
      and if we take xor of anything with 0 we will get that no only and if we do xor with same no then we will get 0 , so like 
      this we will get the single element only, 0^(anything)-> anything  and (anything)^(anything)-> 0
      
      
      class Solution {
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
    
      bruteForceCode: `Loop i from 0 to 2ⁿ-1, treat each i's binary form as an include/exclude switch for every element in nums
      (i & (1 << j))-> checks the bit at the j-th place of i if it is 1(means some value other than 0) then add in subset and if 
      0 dont add it.  Every element has exactly 2 choices: include it (1) or exclude it (0). Binary numbers from 0 to 2ⁿ−1
      generate every possible combination of these 0/1 choices exactly once.
      
      class Solution {
        public List<List<Integer>> subsets(int[] nums) {
            List<List<Integer>> result = new ArrayList<>();
            int n = nums.length;
            for (int i = 0; i < (1 << n); i++) {   // 0 to 2^n - 1
                List<Integer> subset = new ArrayList<>();
                for (int j = 0; j < n; j++) {
                    if ((i & (1 << j)) != 0) {       //Is the j-th bit of i equal to 1?
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
    
      bruteForceCode: `Initialize xor as 0 and the xor ^= i; that it
      
    
      class Solution {
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
    
      optimalCode: `1st we need to calculate rightmost(xor & -xor) and then we r storing two diff nums in diff varaable and if we r getting 
      that same value again the it will go in that same variable and become 0 and new no will be stored and no which will be only 1 
      that will be left only and we get our desired ans
      
      class Solution {
        public int[] singleNumber(int[] nums) {
            int xor = 0;
            for (int num : nums) xor ^= num;
            
            //rightmost set(1'st) bit of xor (6=110  and  rightmost=010 )
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
    
      bruteForceCode: `In this simply we r checking that while(n%i==0) till the we will add that i in ans 
      and after each we will do n/=i as we have factored it by that i so we will work on new n
      
      
      class Solution {
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
    
      optimalCode: `here basically we r storing if n%2==0 add in ans and same for n%3==0 then also store
       it and at last if n>2 then add it directly
      
      
      class Solution {
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
    
      bruteForceCode: `simple for each i of for loop check if(n%i==0) that is ans add it in result
      
      class Solution {
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
    
      optimalCode: `here basically we r checking if(n%i==0) ten add that in ans and one more check we r doing in that same loop 
      that if(i!=n/i) add that also in ans, this basically is reducing time, in one time we r checking for 2 that it
      
      
      class Solution {
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
    
      bruteForceCode: `here basically we r calling prime function for each value in (L to R) and if that that value%2==0 
      then that is not prime no and we will return false and we iit doesnt satisfy that condn then return true and count++
      
      
      class Solution {
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
    
      bruteForceCode: `ans*=x that it and return n<0?1/ans:ans;
      
      
      class Solution {
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
    
      optimalCode: `In this basically we r calling funtion again and again by doing n/2 till base case returns then it will 
      backtrack and find values for eaach n using if(n%==0)-> return half*half and if odd then half*half*x this way and 
      if n<0(means negative)-> then just x=1/n and n=-n that it 
      
      
      class Solution {
        public double myPow(double x, int n) {
            if (n == 0) return 1.0;
            if (n < 0) {
                x = 1 / x;
                n = -n;
            }
            return fastPow(x, n);
        }
        
        private double fastPow(double x, long n) {           //long stores whole numbers, while double stores decimal numbers.
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
    
      bruteForceCode: `here we r using nested for loop and we r storing each char in set and if a char is already
       present in set break at that moment only
      

      class Solution {
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
    
      optimalCode: `"Keep expanding the window until you hit a repeat. When you hit a repeat, shrink the window just enough to remove the old duplicate, 
      and keep track of the biggest window you ever had.", when we r getting the repeated char then we r removing that from our window with help of left.
      as all non repeated char has lastIndex[ch]=-1 and if it is diff from -1 it means it has already appeared 
      
      class Solution {
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
    
                lastIndex[ch] = right;             // lastIndex['a'] = 0
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
    
      bruteForceCode: `Here same as previous only using nested for loop and getting length with j-i+1 and 
      if nums[j]==0 zeroes++ and if zeroes> k break instantly as previous one
      
      
      class Solution {
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
    
      optimalCode: `this also same as previous only we r tracking zeroes and when we get zeroes>k then we will
       shift our left till we get zeroes<k and hence we calculate for mew(means right-left+1)
      
      class Solution {
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
    
      bruteForceCode: `same as previous only using nested for loop and keep tracking of ecahh fruits in map along with their count and
       if map.size()>2 bresk at that moment only as at most two distinct fruits we want
      
      
      class Solution {
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
    
      optimalCode: `Here basically we r storing nums along with their count and if map size>k then we start decreasing count of fruit[left]
       and left++ ones and get ans like this 
      
      
      class Solution {
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
    
      bruteForceCode: `See here basically we r doing if(len-maxfreq<=k)-> ans=max(ans,len), see len i storing the comp length(j-i+1) and maxfreq 
      is storing the freq and if we r at out desired char(A) then len- maxfreq=0  becoz we will get same values for both len and maxfreq and if 
      diff char then we will get the value , the no of times it has appeared
      
      
      class Solution {
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
    
      optimalCode: `Here also same only but while(len-maxfreq>k) then we will decrease freq of char at left by 1 
      and then left++, and try for the next char that it
      
      
      class Solution {
        public int characterReplacement(String s, int k) {
            int[] freq = new int[26];
    
            int left = 0;
            int maxFreq = 0;
            int ans = 0;
    
            for(int right = 0; right < s.length(); right++) {
                freq[s.charAt(right)-'A']++;
    
                maxFreq = Math.max(maxFreq,
                                   freq[s.charAt(right)-'A']);
    
                while((right - left + 1) - maxFreq > k) {     // (3-0+1)-1 >2   when right=3  for "ABCD"
                    freq[s.charAt(left)-'A']--;               // we remove A
                    left++;                                   // left=1
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
    
      bruteForceCode: `Simple sum+=nums[j] and then if(sum==goal) count++
      
      
      class Solution {
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
    
      optimalCode: `Exactly same as previous only while(sum>goal)-> sum-=nums[left] and then left++ 
      and try for next number same as above oone only
      
      
      class Solution {
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
    
      bruteForceCode: `same as above only if(nums[j]%2==1)->odd++ and if(odd==k)-> count++ that it
      
      
      class Solution {
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
    Output: 10  ("abc", "abca", "abcab", "abcabc", "bca", "bcab", "bcabc", "cab", "cabc", "abc")`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(1)`,
    
      bruteForceCode: `Basically here we r checking feq of three char a,b,c and using
      nested for loop and if freq of each char is >0 then count++ that it
      
      class Solution {
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
    
      optimalCode: `Here we r storing the idx position of all the three chars in array list and 
      when again that char appears then that char idx is updated to new idx
      min(last[a], last[b], last[c]) tells you the rightmost point up to which a starting index
      is still "safe" (still captures all 3 characters). Since valid starts range from 0 to that
      minimum value, there are exactly min + 1 such starting positions — and each one produces
      a distinct valid substring ending at i
      
      
      class Solution {
        public int numberOfSubstrings(String s) {
            int[] last = {-1,-1,-1};     // last=[-1,-1,-1]
    
            int count = 0;
    
            for(int i = 0; i < s.length(); i++) {
                last[s.charAt(i)-'a'] = i;         // last['a'-'a'=0] = 0, last['b'-'a'=1] = 1, last['c'-'a'=2] = 2
    
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
    
      bruteForceCode: `Here we r using recurssion and returning Max(leftsum of length k from left,  
      right sum of length k from right) by reducing k-- and basecase if k==0 return 0 that it 
      
      
      class Solution {
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
    
      optimalCode: `Here basically we r 1st calculating the 1st k sum from left then we r skipping one by one
      leftmost(1st kth one then to 0 position) and adding the rightmost nums in place of that then in next step we 
      will replace  with the last befor the rightmost and like this we can check from where max sum is there
      
      class Solution {
        public int maxScore(int[] cardPoints, int k) {
            int n = cardPoints.length;
            int leftSum = 0;
            for(int i = 0; i < k; i++) {
                leftSum += cardPoints[i];    //6
            }
            int maxSum = leftSum;
            int rightSum = 0;
            for(int i = k - 1; i >= 0; i--) {
                leftSum -= cardPoints[i];            //leftsum=6-3=3
                rightSum += cardPoints[n - (k - i)];  //rightsum=0+1=1
                maxSum = Math.max(maxSum, leftSum + rightSum);    //(0,4)
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
    
      bruteForceCode: `Here we r using nested for loop and storing each char to map along with their count and when size of map>k
      break and we will store max length with ans=max(ans,j-i+1)
      
      
      class Solution {
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
    
      optimalCode: `In this same yrr as previous ones 1st we will add chars and then while(map.size>k) then we start removing the char
      from the position left(0) till while satisfy and then will add next char when while loop ends to track each element and will 
      store max ans as of before only
      
      class Solution {
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
    
      bruteForceCode: `Use nested for loop and if map.size==k then count++ and if map.size>k then break the loop and
      outside of both for loop return count
      
      class Solution {
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
    
      optimalCode: `Exactly as same previous only same while lool(map.size>k) then start removing char from position left(0) 
      one by one by reducing theeir count one by one and if count becomes 0 for a particular no then while loop ends as > condn
       ends then we will add new char to map and like this we will track the complete string and get the ans and calculate count
       with count += right - left + 1;
      
      
      class Solution {
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
    Input: s = "BANC"
           t = "ABC"
    
    Output: "BANC"`,
    
      bruteForceComplexity: `Time Complexity: O(N^3)
    Space Complexity: O(256)`,
    
      bruteForceCode: `Here we r checking each eubstring of s1 to complete s2 string(that is s2 is coming in s1 substring
      till this length) using nested for loop and checking for all and trying for min length of substring of s1, and in 
      if(freq[ch]-- <= 0) { we dont want 0 becoz in question it has ask that in substring of s t should be present, so it
      cant contain char of t string only and get freq 0 , it should have s char too(even 1 also that iss enough)
      
      
      class Solution {
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
    
      optimalCode: `Here basically 1st we r counting freq of each char of t and then we r traveersing the s string and when we r able to find
       all chars of t in s(at each char founf we r doing count--) and when count==0 then we r calculating min length and to get the shortest
        min length, again we increase freq of char at(0) and if freq of that char>0 then count++ (see one logic is there only t chars can 
        have freq>0 after increasing freq of char at(left) becoz rest char of s have freq in minus(-) as we have decreased in starting) so
         that is a logiv to trach the next shorter length that again when we r getting all 3 chars


      class Solution {
          public String minWindow(String s, String t) {
              int[] freq = new int[256];
              for(char ch : t.toCharArray()) {
                  freq[ch]++;
              }
              int left = 0;
              int count = t.length();              
              int minLen = Integer.MAX_VALUE;
              int start = 0;
              for(int right = 0; right < s.length(); right++) {
                  // If current character is still needed
                  if(freq[s.charAt(right)] > 0) {               
                      count--;            // One required character found, if get 0 then all got found
                  }
                  freq[s.charAt(right)]--;                     //freq[E]=-1
                  while(count == 0) {
                      if(right - left + 1 < minLen) {
                          minLen = right - left + 1;
                          start = left;
                      }
                      freq[s.charAt(left)]++;
                      if(freq[s.charAt(left)] > 0) {
                          count++;        // Window becomes invalid
                      }
                      left++;
                  }
              }
              return minLen == Integer.MAX_VALUE
                    ? ""
                    : s.substring(start, start + minLen);   // if(1,1+4)-> (1,5) substring (excluding 5)
          }
      }`
    },


    {
      title: `QUESTION:
    Given strings s1 and s2, find the minimum contiguous substring of s1 such that s2 appears as a subsequence in it.
    
    EXAMPLE:
    Input:
    s1 = "abcde"
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
                }                 // after this inner loop completes i=4 and j=2
                if(i == n) break;
                int end = i + 1;             // end=5
                j = m - 1;                   // j=2
                while(i >= 0) {
                    if(s1.charAt(i) == s2.charAt(j)) {       // to shrink forward if unnecessary there abcde -> bcde  using backward
                        j--;
                        if(j < 0) break;
                    }
                    i--;
                }                          // when this loop completes i=1 and j=-1
                int windowLen = end - i;    // windowLen=5-1=4
                if(windowLen < minLen) {
                    minLen = windowLen;
                    start = i;
                }
                i++;                          // to move forward for next substring
            }
            return start == -1 ? "": s1.substring(start, start + minLen);  // if(start=1, 1+4=5) substring(1,5) -> bcde
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
    Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
    why using dfs? when we can directly put #, see this example
    X X X X           X X X X
    O O X X -->       O O X X
    X O O X           X O O X
    X X X X           X X X X   
    `,
    
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
    Output: 5
    hit → hot → dot → dog → cog`,


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
    Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
                Level/Distance

                0                 hit (0)
                                    |
                1                 hot (1)
                                /       \
                2          dot (2)      lot (2)
                            |             |
                3         dog (3)      log (3)
                             \           /
                              \         /
                4                cog (4)`,
    
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
                                graph.putIfAbsent(curr, new ArrayList<>());  // here we r constructing graph
                                graph.get(curr).add(next);                // by adding with next
                            } else if (distance.get(next) == distance.get(curr) + 1) {  //it checks that when we form new letter(by changing chars) then is that new char is alredy there, if then add 
                                graph.putIfAbsent(curr, new ArrayList<>());
                                graph.get(curr).add(next);                 // here see in graph we have added log to cog(as when we change each char of log we will get cog) which is already there
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
        
        // here we r using dfs basically to get all path from startword to endword by traversing the graph(look graph above)
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
    
      optimalCode: `u may think that suppose a node has 2 path to reach there with diff length and in this code there is nothing to update 
      distance then is it wrong? NO,  This is correct, because BFS explores nodes level by level. The first time a node is visited, 
      it is guaranteed to be through the shortest path.
      
      class Solution {
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
                
                if (distance > dist[node]) continue;     //It skips zombie entries in the PQ — entries that were valid when added, but a shorter path was found before they got processed.
                
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
    
      optimalCode: `Exactly same as swimming water problem
      
      
      class Solution {
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
    Find the cheapest price from src to dst with at most k stops(means we can stop at k nodes).
    
    EXAMPLE:
    Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
    Output: 700`,
    
      optimalComplexity: `Time Complexity: O(E * K)
    Space Complexity: O(V + E)`,
    
      optimalCode: `
      class Solution {
          public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
              ArrayList<ArrayList<int[]>> adj = new ArrayList<>();
              for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
              
              for (int[] f : flights) {
                  adj.get(f[0]).add(new int[]{f[1], f[2]});
              }
              
              int[] dist = new int[n];
              Arrays.fill(dist, Integer.MAX_VALUE);
              
              Queue<int[]> q = new LinkedList<>();
              q.offer(new int[]{src, 0, 0}); // node, cost, stops
              
              while (!q.isEmpty()) {
                  int[] curr = q.poll();
                  int node = curr[0], cost = curr[1], stops = curr[2];
                  
                  if (stops > k) continue;          //"If I already used more stops than allowed just to get to this node,
                                                    //don't bother exploring further from here — this path is already invalid."
                  for (int[] nei : adj.get(node)) {
                      int next = nei[0], price = nei[1];
                      int newCost = cost + price;
                      // Only prune if this path can't possibly help (no dist check tied to stops)
                      if (newCost < dist[next]) {
                          dist[next] = newCost;
                          q.offer(new int[]{next, newCost, stops + 1});
                      } 
                      // still explore even if not globally better, as long as stops allow it
                      else if (stops + 1 <= k) {
                          q.offer(new int[]{next, newCost, stops + 1});
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
    
      optimalCode: `In this we r checking in how many ways we can go from node 0 to n-1 node and thet must be less than n, so for this we do as usual only 
      if(dist[node]+wt<dist[next]) then we equate and for ways ways[nest]=ways[node] in this condn else(dist[node]+wt=dist[next]) then ways[next]=ways[next]+ways[node]
      
      
      class Solution {
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
                    if (dist[(int)node] + weight < dist[(int)next]) {        //dist[6]=7, ways[6]=ways[0]=1, push (6,7)
                        dist[(int)next] = dist[(int)node] + weight;          //dist[1]=2, ways[1]=1, push (1,2)
                        ways[(int)next] = ways[(int)node];                   //dist[4]=5, ways[4]=1, push (4,5)
                        pq.offer(new long[]{next, dist[(int)next]});
                    } else if (dist[(int)node] + weight == dist[(int)next]) {
                        ways[(int)next] = (ways[(int)next] + ways[(int)node]) % MOD;    //ways[6] = ways[6]+ways[4] = 1+1 = 2
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
    
      optimalCode: `basically its like dp so we r traversing V-1 times to get the smallest shortest path from each node to the other node 
      and then for checking negative cycle we r applying the same condn but on the updated matrix 
      
      
      class Solution {
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
    Explanation: matrix[0][0] is storing the distance from vertex 0 to vertex 0, the distance from vertex 0 to vertex 1 is 2 and so on.
     Floyd-Warshall finds shortest paths between every single pair of cities in one go.`,
    
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
    
      optimalCode: `in PQ make condn of asc order based on weight and then in starting put 1st node to quesue and sum+=w and 
      then traverse all neighbours that it as in pq we will get based on sorted so we will get min cost
      
      
      class Solution {
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
    
      optimalCode: `connect edges and then sort them based on their weights then check if curr node and neigh,
       there parents r diff then join them using ds.union



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
    
      optimalCode: ` join the connections using ds.union and after doing all these, 
      check if ds.find(i)==i then component++ using for loop and at last return components-1
      
      
      class Solution {
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
    
      optimalCode: `In this check if two points have same col or row then join then ds.union and after doing all these, 
      check if ds.find(i)==i then component++ using for loop and at last return n-components
      
      
      class Solution {
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
    
      optimalCode: `use nested for loop and put only all emails of each person and if there is already email present in map(means two emails same) then join then-> 
      ds.union(i, emailToIndex.get(email)->index of account where email first appeared); then put each root(no) with their emails(same emails of diff person wil get in one only->ds)
      then in last step sort emails 1st and then add name of email person in starting and then add to final result



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
    
      optimalCode: `In this 1st we r making each given position to island and then we r travesing neighbour for each position and if there is 
      any other island in its neghbour then join then using ds.union and mark them as one island by island--


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
    
      optimalCode: `In this 1st we r calculating toatl island(if connected and seperate one also) with ds.union and increasing rank of one parent node
       and in next step we r changing each 0 to 1 and then checking for the largest island, size += getComponentSize(ds, ni * n + nj);-> gives us the rank 
       of that combined island, in dirns we considered as 1D array and for calculating current state->int nidx = ni * n + nj;
      

        class Solution {
            public int largestIsland(int[][] grid) {
                int n=grid.length;
                DisjointSet ds=new DisjointSet(n*n);
                int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
                int maxSize=0;

                for(int i=0;i<n;i++){
                    for(int j=0;j<n;j++){
                        if(grid[i][j]==1){
                            int idx=i*n+j;
                            for(int[] d:dirs){
                                int ni=i+d[0],nj=j+d[1];
                                if(ni>=0&&ni<n&&nj>=0&&nj<n&&grid[ni][nj]==1){
                                    ds.union(idx,ni*n+nj);
                                }
                            }
                        }
                    }
                }

                for(int i=0;i<n;i++){
                    for(int j=0;j<n;j++){
                        if(grid[i][j]==0){
                            Set<Integer> roots=new HashSet<>();
                            int size=1;
                            for(int[] d:dirs){
                                int ni=i+d[0],nj=j+d[1];
                                if(ni>=0&&ni<n&&nj>=0&&nj<n&&grid[ni][nj]==1){
                                    int node=ni*n+nj;
                                    int root=ds.find(node);
                                    if(!roots.contains(root)){
                                        roots.add(root);
                                        size+=getComponentSize(ds,node);
                                    }
                                }
                            }
                            maxSize=Math.max(maxSize,size);
                        }
                    }
                }
                return maxSize==0?n*n:maxSize;
            }

            private int getComponentSize(DisjointSet ds,int node){
                int root=ds.find(node);
                return ds.size[root];
            }

            class DisjointSet{
                int[] parent;
                int[] size;

                DisjointSet(int n){
                    parent=new int[n];
                    size=new int[n];
                    for(int i=0;i<n;i++){
                        parent[i]=i;
                        size[i]=1;
                    }
                }

                int find(int x){
                    if(parent[x]==x)return x;
                    return parent[x]=find(parent[x]);
                }

                void union(int a,int b){
                    int rootA=find(a);
                    int rootB=find(b);
                    if(rootA==rootB)return;

                    if(size[rootA]<size[rootB]){
                        int temp=rootA;
                        rootA=rootB;
                        rootB=temp;
                    }

                    parent[rootB]=rootA;
                    size[rootA]+=size[rootB];
                }
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
    
      optimalCode: `basically mid(time) is our desired time and we r checking for diff mid(time) through BS , calling function in which 
      we r performing while q.isEmpty and for every new mid value we r calling same function from stating
      
      
      class Solution {
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
    
      optimalCode: `apply dfs stating with node 0 and consider parent as -1 and traverse eaach node with dfs calling again and again and mark 
      visited and if visited neigh come again then mark low of that node to min(low[node], dist[neigh]) and then backtrack and there mark low[node]
      as min(low[node],low[neigh])
      
      
      class Solution {
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
            int[] time = {0}; // mutable counter shared across recursive calls
            
            for (int i = 0; i < V; i++) {
                if (!visited[i]) {
                    dfs(i, adj, visited, disc, low, parent, ap, time, result);             // will know the updated values
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
    Given a directed graph with V vertices and E edges, find the number of Strongly Connected Components (SCCs) using Kosaraju's Algorithm,
    The question is asking you to find how many groups of vertices exist where every vertex can reach every other vertex in the same group.    
    EXAMPLE:
    Input: V = 5, edges = [[0,1],[1,2],[2,0],[1,3],[3,4],[4,3]]
    Output: 2 
    {0,1,2} and {3,4}`,
    
      optimalComplexity: `Time Complexity: O(V + E)
    Space Complexity: O(V + E)`,
    
      optimalCode: `traverse all nodes and push them in stack using dfs in such a way that all neigh visited first 
      then should go in stack then transpose the matrix and remove each node from stack through dfs and count scc.
      First store nodes in decreasing finishing time using DFS, then run DFS on the reversed graph in that 
      order so that each DFS visits exactly one Strongly Connected Component (SCC).
      
      
      class Solution {
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
                    List<Integer> currentSCC = new ArrayList<>();
                    dfs2(transpose, node, visited, currentSCC);
                    sccCount++;
                    // Print this SCC
                    System.out.println("SCC " + sccCount + ": " + currentSCC);
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
        
        private void dfs2(ArrayList<ArrayList<Integer>> transpose, int node, boolean[] visited, List<Integer> currentSCC) {
            visited[node] = true;
            currentSCC.add(node);
            for (int nei : transpose.get(node)) {
                if (!visited[nei]) {
                    dfs2(transpose, nei, visited, currentSCC);
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
    Output: 2
            helper(4)
        │
        ├── One Step → helper(3) + |4-5|
        │              = helper(3) + 1
        │
        │   helper(3)
        │   │
        │   ├── One Step → helper(2) + |5-3|
        │   │              = helper(2) + 2
        │   │
        │   │   helper(2)
        │   │   │
        │   │   ├── One Step → helper(1) + |3-1|
        │   │   │              = helper(1) + 2
        │   │   │
        │   │   │   helper(1)
        │   │   │   │
        │   │   │   ├── One Step → helper(0) + |1-2|
        │   │   │   │              = 0 + 1
        │   │   │   │              = 1
        │   │   │   │
        │   │   │   └── helper(1)=1
        │   │   │
        │   │   ├── Cost = 1 + 2 = 3
        │   │   │
        │   │   ├── Two Step → helper(0) + |3-2|
        │   │   │              = 0 + 1
        │   │   │              = 1
        │   │   │
        │   │   └── helper(2)=min(3,1)=1
        │   │
        │   ├── Cost = 1 + 2 = 3
        │   │
        │   ├── Two Step → helper(1) + |5-1|
        │   │
        │   │   helper(1)=1
        │   │
        │   ├── Cost = 1 + 4 = 5
        │   │
        │   └── helper(3)=min(3,5)=3
        │
        ├── Cost = 3 + 1 = 4
        │
        ├── Two Step → helper(2) + |4-3|
        │
        │   helper(2)
        │   │
        │   └── =1
        │
        ├── Cost = 1 + 1 = 2
        │
        └── helper(4)=min(4,2)=2`,
    
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
    Output: 15
            helper(4)
        │
        ├── Jump 1 → helper(3) + |15-0|
        │            = helper(3) + 15
        │
        │   helper(3)
        │   │
        │   ├── Jump 1 → helper(2) + |0-20|
        │   │            = helper(2) + 20
        │   │
        │   │   helper(2)
        │   │   │
        │   │   ├── Jump 1 → helper(1) + |20-5|
        │   │   │            = helper(1) + 15
        │   │   │
        │   │   │   helper(1)
        │   │   │   │
        │   │   │   ├── Jump 1 → helper(0) + |5-10|
        │   │   │   │            = 0 + 5
        │   │   │   │            = 5
        │   │   │   │
        │   │   │   └── helper(1)=5
        │   │   │
        │   │   ├── Cost = 5 + 15 = 20
        │   │   │
        │   │   ├── Jump 2 → helper(0) + |20-10|
        │   │   │            = 0 + 10
        │   │   │            = 10
        │   │   │
        │   │   └── helper(2)=min(20,10)=10
        │   │
        │   ├── Cost = 10 + 20 = 30
        │   │
        │   ├── Jump 2 → helper(1) + |0-5|
        │   │
        │   │   helper(1)
        │   │   │
        │   │   └── =5
        │   │
        │   ├── Cost = 5 + 5 = 10
        │   │
        │   └── helper(3)=min(30,10)=10
        │
        ├── Cost = 10 + 15 = 25
        │
        ├── Jump 2 → helper(2) + |15-20|
        │
        │   helper(2)
        │   │
        │   └── =10
        │
        ├── Cost = 10 + 5 = 15
        │
        └── helper(4)=min(25,15)=15`,
    
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
    Output: 13

                helper(0,0)
            │
            ├── helper(1,0)=13
            │      ├──7
            │      ├──INF
            │      └──8
            │
            ├── helper(1,-1)=INF
            │
            └── helper(1,1)=12
                ├──8
                ├──7
                └──9

            Result = 2(matrix[i][j]) +12=14           similarly for helper(0,1) and helper(0,2) of for loop`,
    
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
    //So if one subset has sum j, then the other subset must have sum (total - j) and That's why every true represents one valid partition of the array.
                if (dp[n][j] == true) {             //Using ALL elements, can I make subset sum = j ?
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
                for (int j = 1; j <= K; j++) {
    
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
                for (int j = 1; j <= target; j++) {
    
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
 //means the upper cell has a longer LCS, so we take str1.charAt(i-1) and move up (i--) to keep more common characters in the final SCS.
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
    
      optimalCode: `dp[i] means: length of the longest increasing subsequence ending exactly at index i.
      and this pattern is used in all questions of this type so keep in mind and then solve becomes easy

      
      
      class Solution {
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
    
      optimalCode: `basically same as above only u can think that why it has not used Mat.max one condn 
      instead have used one more condn becoz we need to track j in this case for printing the longest subsequence
      
      
      class Solution {
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
                }               // dp- 1 1 1 2 2 3 4 4   // prev-  -1 -1 -1  2  2  3  5  5
                if (dp[i] > maxLen) {
                    maxLen = dp[i];
                    lastIdx = i;
                }
            }
            
            List<Integer> lis = new ArrayList<>();
            while (lastIdx != -1) {
                lis.add(nums[lastIdx]);
                lastIdx = prev[lastIdx];    //lastIdx = prev[lastIdx] follows the stored parent pointers from the last element of the longest increasing subsequence back to its first element, thereby reconstructing the complete LIS.
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
    
      optimalCode: `this one is exactly same as the previous one , u can check only one condn changes rest all same
      
      
      class Solution {
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
        //  If nums[i] can be added after nums[j] and doing so creates a longer divisible subset than the current best for nums[i], then update it.           
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
    
      optimalCode: `dp[i] stores till i how longest the length of string(made from previous strings by adding a single letter) by 
      calling a function we will check , only this is the diff rest all is same as 1st question only
      
      
      class Solution {
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
    
      optimalCode: `exactly similar to previous concepts only yrr same pattern too easy just n
      need one condn in every prolm nums[i]> nums[j] that it , all sorted after that
      In this we r calculating 2 things lis[i] which store till i how many nums r 
      strictly increasing and one is lds[i] which stores till i haow many r strictly decreasing 
      
      
      class Solution {
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
                }                                //lis:   1  2  2  3  4  2  1
            }
            
            // Longest Decreasing from right
            for (int i = n-2; i >= 0; i--) {
                for (int j = n-1; j > i; j--) {
                    if (nums[i] > nums[j]) lds[i] = Math.max(lds[i], lds[j] + 1);
                }                                 //lds:   1  3  2  3  3  2  1
            }
            
            int max = 0;
            for (int i = 0; i < n; i++) {
                max = Math.max(max, lis[i] + lds[i] - 1);    //Why -1? ->Because the peak element is counted in both arrays.
            }
            return max;          //1 → 2 → 3 → 5 → 2 → 1
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
    
      optimalCode: `same as aabove questions , same pattern , and always solve 1st question of this pattern 
      here in dp we r calculating the length of the longest strictly increasing subsequence (LIS) 
      that ends exactly at index i and count[i] calculates that till i how many longesst subsequences can be formed
      
      
      
      class Solution {
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
        Input: arr = [40, 20, 30]
        Output: 24000
                                helper(1,2)
                                |
                    -------------------------
                    |                       |
                helper(1,1)            helper(2,2)
                    |                       |
                return 0               return 0

        Cost = 0 + 0 + (40 × 20 × 30)
            = 24000

        Return 24000
        
    // for DP one
                    j
                0      1        2
            ------------------------
        i=0 |   0      0        0

        i=1 |   0      0     24000

        i=2 |   0      0        0`,
    
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
    
      optimalCode: `here basically we r trying to to check that if we take cut at k=1 then we r getting
      minimum cost or at k=2 and so on and here main thing is recurssion and backtracking, for clarity 
      always do dry run on 2x2 matrix and u will get clarity that how it is working, amin functionallity
      is of arr[i-1] * arr[k] * arr[j]; only and dp[i][k] and dp[k+1][j] is basically calculate values
      going backtrack and bring values either from base case or arr[i-1] * arr[k] * arr[j];
      
      class Solution {
        public int matrixMultiplication(int[] arr) {
            int n = arr.length;
            int[][] dp = new int[n][n];
            
            for (int len = 2; len < n; len++) {   //len decides how many matrices are included in the current chain.
                for (int i = 1; i < n - len + 1; i++) {  //i decides the starting matrix of the current chain.
                    int j = i + len - 1;                 //j calculates the ending matrix of the current chain.
                    dp[i][j] = Integer.MAX_VALUE;
                    for (int k = i; k < j; k++) {   //k tries every possible place to split the current chain and chooses the minimum cost.
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
    
      optimalCode: `This is also same as MCM only but diff is that here we r creating an arrray and putting arr[0]=0 and arr[n-1]=n 
      becoz in this question we have given cuts and and whenever we made a cut it will cost to the original length of the rod so we 
      add 0 and n so that when we make 1st cut we can consoder the whole length of rod and dp[i][k - 1]+ dp[k + 1][j] why we r ignoring
      k becoz when we made a cut at k then that will be lost and to get cost of that cut we use (arr[j + 1] - arr[i - 1]); as MCM
      and dp[i][k - 1]+ dp[k + 1][j]  r for backtrack to get values through base case and (arr[j + 1] - arr[i - 1]);


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
    
    Coins collected are:
    Burst 1: 3 × 1 × 5 = 15
    Burst 5: 3 × 5 × 8 = 120
    Burst 3: 1 × 3 × 8 = 24
    Burst 8: 1 × 8 × 1 = 8
    Total= 15 + 120 + 24 + 8 = 167`,
    
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
    
      optimalCode: `here also exactly same as rod cutting and adding 1 at arr[0] and arr[n] becoz here our
       cost is calculated by multiplying the current elemeent by it right and left neighbour and in this also 
       we r not considering th current (k) value becoz when we mutliply that we have to remove that element 
       completely arr[i - 1] * arr[k] * arr[j + 1];


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
    
      optimalCode: `In this we r checking for each and combined character that is it palindrome and in 
      dp we r storing that till each cuts how many cuts we need to make it palindrome


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
    
      optimalCode: `In this see dp[0] will be max becoz we r coverring that if we cover this much then what will be max, so now basically we r s
      tarting at last index using nested for loop so that we can travese each node to as desired(means till k) we r taking j limit as 
      j<n && j<i+k, now basicallly we r trying to change each current no to be same at 3(k) values and we r storingthe max of it in dp[i] taht if 
      we replace this current value to 2 places then it is max or till 33 ten it is max and we r doing this for all nums and storing max of all in dp[i]
      
      
      class Solution {
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
    
                dp[i] = best;          //dp[i] = the maximum sum achievable by optimally partitioning the suffix arr[i..n-1] (i.e., everything from index i to the end of the array).
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
  ],


  "recurssion-&-backtracking":[

    {
      title: `QUESTION:
    Given an array of distinct integers candidates and a target integer target, return all unique combinations where the chosen numbers sum to target. The same number may be chosen an unlimited number of times.
    
    EXAMPLE:
    Input: candidates = [2,3,6,7], target = 7
    Output: [[2,2,3],[7]]`,
    
      bruteForceComplexity: `Time Complexity: O(2^target) worst case — explores every combination without early cutoff
    Space Complexity: O(target) recursion depth`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> combinationSum(int[] candidates, int target) {
            List<List<Integer>> result = new ArrayList<>();
            explore(candidates, target, 0, new ArrayList<>(), result);
            return result;
        }
    
        // tries every candidate at every index without sorting or pruning by value
        private void explore(int[] candidates, int remaining, int index, List<Integer> current, List<List<Integer>> result) {
            if (remaining == 0) {
                result.add(new ArrayList<>(current));
                return;
            }
            if (remaining < 0 || index == candidates.length) return;
    
            for (int i = index; i < candidates.length; i++) {
                current.add(candidates[i]);
                explore(candidates, remaining - candidates[i], i, current, result); // can reuse same index
                current.remove(current.size() - 1); // backtrack
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(2^target) worst case, but pruned significantly by sorting
    Space Complexity: O(target)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> combinationSum(int[] candidates, int target) {
            List<List<Integer>> result = new ArrayList<>();
            Arrays.sort(candidates); // enables early break
            backtrack(candidates, target, 0, new ArrayList<>(), result);
            return result;
        }
    
        private void backtrack(int[] candidates, int remaining, int start, List<Integer> current, List<List<Integer>> result) {
            if (remaining == 0) {
                result.add(new ArrayList<>(current));
                return;
            }
            for (int i = start; i < candidates.length; i++) {
                if (candidates[i] > remaining) break; // sorted -> prune rest immediately
                current.add(candidates[i]);
                backtrack(candidates, remaining - candidates[i], i, current, result);
                current.remove(current.size() - 1); // backtrack
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a collection of candidate numbers (candidates) that may contain duplicates and a target integer target, return all unique combinations where the chosen numbers sum to target. Each number may be used at most once.
    
    EXAMPLE:
    Input: candidates = [10,1,2,7,6,1,5], target = 8
    Output: [[1,1,6],[1,2,5],[1,7],[2,6]]`,
    
      bruteForceComplexity: `Time Complexity: O(2^N) plus HashSet overhead to dedupe
    Space Complexity: O(2^N * N)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> combinationSum2(int[] candidates, int target) {
            Set<List<Integer>> uniqueResults = new HashSet<>();
            Arrays.sort(candidates); // only for consistent output within each combo
            explore(candidates, target, 0, new ArrayList<>(), uniqueResults);
            return new ArrayList<>(uniqueResults);
        }
    
        // include/exclude recursion, dedupe with a Set instead of skipping in-loop
        private void explore(int[] candidates, int remaining, int index, List<Integer> current, Set<List<Integer>> result) {
            if (remaining == 0) {
                result.add(new ArrayList<>(current));
                return;
            }
            if (remaining < 0 || index == candidates.length) return;
    
            // exclude candidates[index]
            explore(candidates, remaining, index + 1, current, result);
    
            // include candidates[index]
            current.add(candidates[index]);
            explore(candidates, remaining - candidates[index], index + 1, current, result);
            current.remove(current.size() - 1); // backtrack
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(2^N) worst case, pruned via sorting + duplicate skip
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> combinationSum2(int[] candidates, int target) {
            List<List<Integer>> result = new ArrayList<>();
            Arrays.sort(candidates);
            backtrack(candidates, target, 0, new ArrayList<>(), result);
            return result;
        }
    
        private void backtrack(int[] candidates, int remaining, int start, List<Integer> current, List<List<Integer>> result) {
            if (remaining == 0) {
                result.add(new ArrayList<>(current));
                return;
            }
            for (int i = start; i < candidates.length; i++) {
                if (candidates[i] > remaining) break; // sorted -> prune rest
                if (i > start && candidates[i] == candidates[i - 1]) continue; // skip same-level duplicates
                current.add(candidates[i]);
                backtrack(candidates, remaining - candidates[i], i + 1, current, result); // move to i+1, each used once
                current.remove(current.size() - 1); // backtrack
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of s.
    
    EXAMPLE:
    Input: s = "aab"
    Output: [["a","a","b"],["aa","b"]]`,
    
      bruteForceComplexity: `Time Complexity: O(N * 2^N) — checks palindrome from scratch for every substring
    Space Complexity: O(N) recursion depth`,
    
      bruteForceCode: `class Solution {
        public List<List<String>> partition(String s) {
            List<List<String>> result = new ArrayList<>();
            explore(s, 0, new ArrayList<>(), result);
            return result;
        }
    
        private void explore(String s, int start, List<String> current, List<List<String>> result) {
            if (start == s.length()) {
                result.add(new ArrayList<>(current));
                return;
            }
            for (int end = start + 1; end <= s.length(); end++) {
                String substr = s.substring(start, end);
                if (isPalindrome(substr)) { // re-checks palindrome character by character every call
                    current.add(substr);
                    explore(s, end, current, result);
                    current.remove(current.size() - 1); // backtrack
                }
            }
        }
    
        private boolean isPalindrome(String str) {
            int left = 0, right = str.length() - 1;
            while (left < right) {
                if (str.charAt(left++) != str.charAt(right--)) return false;
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N * 2^N) worst case, but avoids redundant palindrome checks via precomputed DP table
    Space Complexity: O(N^2) for the DP table + O(N) recursion`,
    
      optimalCode: `class Solution {
        public List<List<String>> partition(String s) {
            int n = s.length();
            boolean[][] isPalin = new boolean[n][n];
            // precompute all palindrome substrings in O(N^2)
            for (int end = 0; end < n; end++) {
                for (int start = 0; start <= end; start++) {
                    if (s.charAt(start) == s.charAt(end) && (end - start <= 2 || isPalin[start + 1][end - 1])) {
                        isPalin[start][end] = true;
                    }
                }
            }
    
            List<List<String>> result = new ArrayList<>();
            backtrack(s, 0, isPalin, new ArrayList<>(), result);
            return result;
        }
    
        private void backtrack(String s, int start, boolean[][] isPalin, List<String> current, List<List<String>> result) {
            if (start == s.length()) {
                result.add(new ArrayList<>(current));
                return;
            }
            for (int end = start; end < s.length(); end++) {
                if (isPalin[start][end]) { // O(1) lookup instead of re-scanning
                    current.add(s.substring(start, end + 1));
                    backtrack(s, end + 1, isPalin, current, result);
                    current.remove(current.size() - 1); // backtrack
                }
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an integer n, place n non-attacking queens on an n x n chessboard, and return all distinct board configurations.
    
    EXAMPLE:
    Input: n = 4
    Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`,
    
      bruteForceComplexity: `Time Complexity: O(N^N) — tries every column in every row, validating with full board scan each time
    Space Complexity: O(N^2) for the board`,
    
      bruteForceCode: `class Solution {
        public List<List<String>> solveNQueens(int n) {
            List<List<String>> result = new ArrayList<>();
            char[][] board = new char[n][n];
            for (char[] row : board) Arrays.fill(row, '.');
            solve(board, 0, n, result);
            return result;
        }
    
        private void solve(char[][] board, int row, int n, List<List<String>> result) {
            if (row == n) {
                result.add(construct(board));
                return;
            }
            for (int col = 0; col < n; col++) {
                if (isSafe(board, row, col, n)) { // full O(N) scan every check
                    board[row][col] = 'Q';
                    solve(board, row + 1, n, result);
                    board[row][col] = '.'; // backtrack
                }
            }
        }
    
        private boolean isSafe(char[][] board, int row, int col, int n) {
            for (int i = 0; i < row; i++) if (board[i][col] == 'Q') return false;
            for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 'Q') return false;
            for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) if (board[i][j] == 'Q') return false;
            return true;
        }
    
        private List<String> construct(char[][] board) {
            List<String> rows = new ArrayList<>();
            for (char[] row : board) rows.add(new String(row));
            return rows;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N!) practically — pruned heavily via O(1) conflict checks
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<List<String>> solveNQueens(int n) {
            List<List<String>> result = new ArrayList<>();
            int[] queenCol = new int[n]; // queenCol[row] = column of queen in that row
            boolean[] cols = new boolean[n];
            boolean[] diag1 = new boolean[2 * n]; // row - col + n
            boolean[] diag2 = new boolean[2 * n]; // row + col
            solve(0, n, queenCol, cols, diag1, diag2, result);
            return result;
        }
    
        private void solve(int row, int n, int[] queenCol, boolean[] cols, boolean[] diag1, boolean[] diag2, List<List<String>> result) {
            if (row == n) {
                result.add(construct(queenCol, n));
                return;
            }
            for (int col = 0; col < n; col++) {
                int d1 = row - col + n, d2 = row + col;
                if (cols[col] || diag1[d1] || diag2[d2]) continue; // O(1) conflict check
    
                queenCol[row] = col;
                cols[col] = diag1[d1] = diag2[d2] = true;
    
                solve(row + 1, n, queenCol, cols, diag1, diag2, result);
    
                cols[col] = diag1[d1] = diag2[d2] = false; // backtrack
            }
        }
    
        private List<String> construct(int[] queenCol, int n) {
            List<String> board = new ArrayList<>();
            for (int row = 0; row < n; row++) {
                char[] line = new char[n];
                Arrays.fill(line, '.');
                line[queenCol[row]] = 'Q';
                board.add(new String(line));
            }
            return board;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Write a program to solve a Sudoku puzzle by filling the empty cells ('.') such that each row, column, and 3x3 sub-box contains digits 1-9 without repetition.
    
    EXAMPLE:
    Input: A partially filled 9x9 board
    Output: The board filled in with a valid solution`,
    
      bruteForceComplexity: `Time Complexity: O(9^(N*N)) — tries digits 1-9 in every empty cell, validating via full row/col/box scan
    Space Complexity: O(N*N) recursion + board`,
    
      bruteForceCode: `class Solution {
        public void solveSudoku(char[][] board) {
            solve(board);
        }
    
        private boolean solve(char[][] board) {
            for (int row = 0; row < 9; row++) {
                for (int col = 0; col < 9; col++) {
                    if (board[row][col] == '.') {
                        for (char digit = '1'; digit <= '9'; digit++) {
                            if (isValid(board, row, col, digit)) { // O(N) scan every check
                                board[row][col] = digit;
                                if (solve(board)) return true;
                                board[row][col] = '.'; // backtrack
                            }
                        }
                        return false; // no digit worked here
                    }
                }
            }
            return true; // no empty cells left
        }
    
        private boolean isValid(char[][] board, int row, int col, char digit) {
            for (int i = 0; i < 9; i++) {
                if (board[row][i] == digit) return false;
                if (board[i][col] == digit) return false;
                if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == digit) return false;
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(9^(N*N)) worst case, but pruned heavily via O(1) constraint lookups
    Space Complexity: O(N*N)`,
    
      optimalCode: `class Solution {
        boolean[][] rows = new boolean[9][10];
        boolean[][] cols = new boolean[9][10];
        boolean[][] boxes = new boolean[9][10];
    
        public void solveSudoku(char[][] board) {
            for (int r = 0; r < 9; r++) {
                for (int c = 0; c < 9; c++) {
                    if (board[r][c] != '.') {
                        int d = board[r][c] - '0';
                        mark(r, c, d, true);
                    }
                }
            }
            solve(board, 0, 0);
        }
    
        private boolean solve(char[][] board, int row, int col) {
            if (row == 9) return true;
            int nextRow = (col == 8) ? row + 1 : row;
            int nextCol = (col == 8) ? 0 : col + 1;
    
            if (board[row][col] != '.') return solve(board, nextRow, nextCol);
    
            for (int d = 1; d <= 9; d++) {
                if (isValid(row, col, d)) { // O(1) lookup instead of scanning
                    board[row][col] = (char) ('0' + d);
                    mark(row, col, d, true);
                    if (solve(board, nextRow, nextCol)) return true;
                    mark(row, col, d, false); // backtrack
                    board[row][col] = '.';
                }
            }
            return false;
        }
    
        private boolean isValid(int row, int col, int d) {
            int box = (row / 3) * 3 + col / 3;
            return !rows[row][d] && !cols[col][d] && !boxes[box][d];
        }
    
        private void mark(int row, int col, int d, boolean value) {
            int box = (row / 3) * 3 + col / 3;
            rows[row][d] = value;
            cols[col][d] = value;
            boxes[box][d] = value;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an undirected graph and an integer m, determine whether the graph's vertices can be colored using at most m colors such that no two adjacent vertices share the same color. Return true if possible, else false.
    
    EXAMPLE:
    Input: graph = [[0,1,1,1],[1,0,1,0],[1,1,0,1],[1,0,1,0]], m = 3
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(m^N) — tries every color for every vertex, checking all edges each time
    Space Complexity: O(N) recursion + color array`,
    
      bruteForceCode: `class Solution {
        public boolean graphColoring(int[][] graph, int m) {
            int n = graph.length;
            int[] color = new int[n];
            return solve(graph, m, color, 0, n);
        }
    
        private boolean solve(int[][] graph, int m, int[] color, int vertex, int n) {
            if (vertex == n) return true;
    
            for (int c = 1; c <= m; c++) {
                if (isSafe(graph, color, vertex, c, n)) { // scans all vertices every check
                    color[vertex] = c;
                    if (solve(graph, m, color, vertex + 1, n)) return true;
                    color[vertex] = 0; // backtrack
                }
            }
            return false;
        }
    
        private boolean isSafe(int[][] graph, int[] color, int vertex, int c, int n) {
            for (int i = 0; i < n; i++) {
                if (graph[vertex][i] == 1 && color[i] == c) return false;
            }
            return true;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(m^N) worst case, pruned via adjacency-list traversal instead of full matrix scan
    Space Complexity: O(N + E)`,
    
      optimalCode: `class Solution {
        public boolean graphColoring(int[][] graph, int m) {
            int n = graph.length;
            List<List<Integer>> adj = new ArrayList<>();
            for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (graph[i][j] == 1) {
                        adj.get(i).add(j);
                        adj.get(j).add(i);
                    }
                }
            }
    
            int[] color = new int[n];
            return solve(adj, m, color, 0, n);
        }
    
        private boolean solve(List<List<Integer>> adj, int m, int[] color, int vertex, int n) {
            if (vertex == n) return true;
    
            for (int c = 1; c <= m; c++) {
                if (isSafe(adj, color, vertex, c)) { // only checks actual neighbors, not full row
                    color[vertex] = c;
                    if (solve(adj, m, color, vertex + 1, n)) return true;
                    color[vertex] = 0; // backtrack
                }
            }
            return false;
        }
    
        private boolean isSafe(List<List<Integer>> adj, int[] color, int vertex, int c) {
            for (int neighbor : adj.get(vertex)) {
                if (color[neighbor] == c) return false;
            }
            return true;
        }
    }`
    },


    {
      title: `QUESTION:
    Given a chessboard of size N x N, find a knight's tour starting from a given cell such that the knight visits every cell exactly once.
    
    EXAMPLE:
    Input: N = 5, start = (0, 0)
    Output: A 5x5 grid showing visit order (0 to 24)`,
    
      bruteForceComplexity: `Time Complexity: O(8^(N*N))
    Space Complexity: O(N*N)`,
    
      bruteForceCode: `class Solution {
        static int[] rowMove = {2, 1, -1, -2, -2, -1, 1, 2};
        static int[] colMove = {1, 2, 2, 1, -1, -2, -2, -1};
    
        public int[][] knightsTour(int n, int startRow, int startCol) {
            int[][] board = new int[n][n];
            for (int[] row : board) Arrays.fill(row, -1);
            board[startRow][startCol] = 0;
            solve(board, startRow, startCol, 1, n);
            return board;
        }
    
        // pure backtracking: fixed move order, no heuristic
        private boolean solve(int[][] board, int row, int col, int moveCount, int n) {
            if (moveCount == n * n) return true;
            for (int i = 0; i < 8; i++) {
                int nr = row + rowMove[i], nc = col + colMove[i];
                if (isValid(board, nr, nc, n)) {
                    board[nr][nc] = moveCount;
                    if (solve(board, nr, nc, moveCount + 1, n)) return true;
                    board[nr][nc] = -1; // backtrack
                }
            }
            return false;
        }
    
        private boolean isValid(int[][] board, int row, int col, int n) {
            return row >= 0 && row < n && col >= 0 && col < n && board[row][col] == -1;
        }
    }`,
    
      optimalComplexity: `Time Complexity: ~O(N^2) practically (Warnsdorff's heuristic avoids near-total backtracking)
    Space Complexity: O(N*N)`,
    
      optimalCode: `class Solution {
        static int[] rowMove = {2, 1, -1, -2, -2, -1, 1, 2};
        static int[] colMove = {1, 2, 2, 1, -1, -2, -2, -1};
    
        public int[][] knightsTour(int n, int startRow, int startCol) {
            int[][] board = new int[n][n];
            for (int[] row : board) Arrays.fill(row, -1);
            board[startRow][startCol] = 0;
            solve(board, startRow, startCol, 1, n);
            return board;
        }
    
        // Warnsdorff's rule: greedily move to the cell with fewest onward moves
        // avoids dead ends almost entirely, so backtracking rarely triggers
        private boolean solve(int[][] board, int row, int col, int moveCount, int n) {
            if (moveCount == n * n) return true;
            List<int[]> nextMoves = new ArrayList<>();
            for (int i = 0; i < 8; i++) {
                int nr = row + rowMove[i], nc = col + colMove[i];
                if (isValid(board, nr, nc, n)) {
                    nextMoves.add(new int[]{nr, nc, countOnward(board, nr, nc, n)});
                }
            }
            nextMoves.sort((a, b) -> a[2] - b[2]);
            for (int[] mv : nextMoves) {
                board[mv[0]][mv[1]] = moveCount;
                if (solve(board, mv[0], mv[1], moveCount + 1, n)) return true;
                board[mv[0]][mv[1]] = -1;
            }
            return false;
        }
    
        private int countOnward(int[][] board, int row, int col, int n) {
            int c = 0;
            for (int i = 0; i < 8; i++)
                if (isValid(board, row + rowMove[i], col + colMove[i], n)) c++;
            return c;
        }
    
        private boolean isValid(int[][] board, int row, int col, int n) {
            return row >= 0 && row < n && col >= 0 && col < n && board[row][col] == -1;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an integer array nums that may contain duplicates, return all possible subsets (the power set), without duplicate subsets.
    
    EXAMPLE:
    Input: nums = [1,2,2]
    Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]`,
    
      bruteForceComplexity: `Time Complexity: O(2^N * N) plus HashSet overhead for dedup
    Space Complexity: O(2^N * N)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> subsetsWithDup(int[] nums) {
            Set<List<Integer>> uniqueSubsets = new HashSet<>();
            generate(nums, 0, new ArrayList<>(), uniqueSubsets);
            return new ArrayList<>(uniqueSubsets);
        }
    
        // plain recursion: include/exclude every element, dedupe afterward
        private void generate(int[] nums, int index, List<Integer> current, Set<List<Integer>> result) {
            if (index == nums.length) {
                List<Integer> sorted = new ArrayList<>(current);
                Collections.sort(sorted);
                result.add(sorted);
                return;
            }
            generate(nums, index + 1, current, result); // exclude
            current.add(nums[index]);
            generate(nums, index + 1, current, result); // include
            current.remove(current.size() - 1); // backtrack
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(2^N * N)
    Space Complexity: O(2^N * N)`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> subsetsWithDup(int[] nums) {
            List<List<Integer>> result = new ArrayList<>();
            Arrays.sort(nums); // enables adjacent-duplicate skipping
            backtrack(nums, 0, new ArrayList<>(), result);
            return result;
        }
    
        // backtracking with sorted-array duplicate skip — no Set/sort-per-subset needed
        private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
            result.add(new ArrayList<>(current));
            for (int i = start; i < nums.length; i++) {
                if (i > start && nums[i] == nums[i - 1]) continue;
                current.add(nums[i]);
                backtrack(nums, i + 1, current, result);
                current.remove(current.size() - 1); // backtrack
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array of integers, sort the array in ascending order.
    
    EXAMPLE:
    Input: nums = [5,2,3,1]
    Output: [1,2,3,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int[] sortArray(int[] nums) {
            recursiveSelectionSort(nums, 0);
            return nums;
        }
    
        // recursive selection sort — pick min of remainder, place, recurse
        private void recursiveSelectionSort(int[] nums, int start) {
            if (start >= nums.length - 1) return;
            int minIndex = start;
            for (int i = start + 1; i < nums.length; i++) {
                if (nums[i] < nums[minIndex]) minIndex = i;
            }
            int temp = nums[start];
            nums[start] = nums[minIndex];
            nums[minIndex] = temp;
            recursiveSelectionSort(nums, start + 1);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public int[] sortArray(int[] nums) {
            if (nums.length <= 1) return nums;
            mergeSort(nums, 0, nums.length - 1);
            return nums;
        }
    
        // divide and conquer
        private void mergeSort(int[] nums, int left, int right) {
            if (left >= right) return;
            int mid = left + (right - left) / 2;
            mergeSort(nums, left, mid);
            mergeSort(nums, mid + 1, right);
            merge(nums, left, mid, right);
        }
    
        private void merge(int[] nums, int left, int mid, int right) {
            int[] temp = new int[right - left + 1];
            int i = left, j = mid + 1, k = 0;
            while (i <= mid && j <= right) {
                temp[k++] = (nums[i] <= nums[j]) ? nums[i++] : nums[j++];
            }
            while (i <= mid) temp[k++] = nums[i++];
            while (j <= right) temp[k++] = nums[j++];
            System.arraycopy(temp, 0, nums, left, temp.length);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an N x N maze with a rat starting at (0,0) trying to reach (N-1,N-1), find all possible paths (moves: D, L, R, U).
    
    EXAMPLE:
    Input: maze = [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]
    Output: ["DDRDRR","DRDDRR"]`,
    
      bruteForceComplexity: `Time Complexity: O(4^(N*N))
    Space Complexity: O(N*N)`,
    
      bruteForceCode: `class Solution {
        public List<String> findPath(int[][] maze, int n) {
            List<String> result = new ArrayList<>();
            boolean[][] visited = new boolean[n][n];
            explore(maze, 0, 0, n, visited, "", result);
            Collections.sort(result);
            return result;
        }
    
        // plain backtracking, no upfront pruning
        private void explore(int[][] maze, int row, int col, int n, boolean[][] visited, String path, List<String> result) {
            if (row < 0 || row >= n || col < 0 || col >= n || maze[row][col] == 0 || visited[row][col]) return;
            if (row == n - 1 && col == n - 1) {
                result.add(path);
                return;
            }
            visited[row][col] = true;
            explore(maze, row + 1, col, n, visited, path + "D", result);
            explore(maze, row - 1, col, n, visited, path + "U", result);
            explore(maze, row, col - 1, n, visited, path + "L", result);
            explore(maze, row, col + 1, n, visited, path + "R", result);
            visited[row][col] = false; // backtrack
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(4^(N*N)) worst case, pruned early via boundary/blocked checks upfront
    Space Complexity: O(N*N)`,
    
      optimalCode: `class Solution {
        static int[] dr = {1, -1, 0, 0};
        static int[] dc = {0, 0, -1, 1};
        static char[] dir = {'D', 'U', 'L', 'R'};
    
        public List<String> findPath(int[][] maze, int n) {
            List<String> result = new ArrayList<>();
            if (maze[0][0] == 0 || maze[n - 1][n - 1] == 0) return result; // early exit
            boolean[][] visited = new boolean[n][n];
            solve(maze, 0, 0, n, visited, new StringBuilder(), result);
            Collections.sort(result);
            return result;
        }
    
        private void solve(int[][] maze, int row, int col, int n, boolean[][] visited, StringBuilder path, List<String> result) {
            if (row == n - 1 && col == n - 1) {
                result.add(path.toString());
                return;
            }
            visited[row][col] = true;
            for (int i = 0; i < 4; i++) {
                int nr = row + dr[i], nc = col + dc[i];
                if (isSafe(maze, nr, nc, n, visited)) {
                    path.append(dir[i]);
                    solve(maze, nr, nc, n, visited, path, result);
                    path.deleteCharAt(path.length() - 1); // backtrack
                }
            }
            visited[row][col] = false;
        }
    
        private boolean isSafe(int[][] maze, int row, int col, int n, boolean[][] visited) {
            return row >= 0 && row < n && col >= 0 && col < n && maze[row][col] == 1 && !visited[row][col];
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array of integers, count the number of inversions. An inversion is a pair (i, j) such that i < j and arr[i] > arr[j].
    
    EXAMPLE:
    Input: arr = [2,4,1,3,5]
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public long countInversions(int[] arr) {
            return countFrom(arr, 0);
        }
    
        // nested recursion mimicking nested loops
        private long countFrom(int[] arr, int i) {
            if (i >= arr.length) return 0;
            return countPairs(arr, i, i + 1) + countFrom(arr, i + 1);
        }
    
        private long countPairs(int[] arr, int i, int j) {
            if (j >= arr.length) return 0;
            long inv = (arr[i] > arr[j]) ? 1 : 0;
            return inv + countPairs(arr, i, j + 1);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public long countInversions(int[] arr) {
            return mergeSortAndCount(arr, 0, arr.length - 1);
        }
    
        private long mergeSortAndCount(int[] arr, int left, int right) {
            long count = 0;
            if (left < right) {
                int mid = left + (right - left) / 2;
                count += mergeSortAndCount(arr, left, mid);
                count += mergeSortAndCount(arr, mid + 1, right);
                count += mergeAndCount(arr, left, mid, right);
            }
            return count;
        }
    
        private long mergeAndCount(int[] arr, int left, int mid, int right) {
            int[] temp = new int[right - left + 1];
            int i = left, j = mid + 1, k = 0;
            long count = 0;
            while (i <= mid && j <= right) {
                if (arr[i] <= arr[j]) {
                    temp[k++] = arr[i++];
                } else {
                    count += (mid - i + 1); // arr[i..mid] all > arr[j]
                    temp[k++] = arr[j++];
                }
            }
            while (i <= mid) temp[k++] = arr[i++];
            while (j <= right) temp[k++] = arr[j++];
            System.arraycopy(temp, 0, arr, left, temp.length);
            return count;
        }
    }`
    },

  ],



  "stack-&-queue":[

    {
      title: `QUESTION:
    Implement a stack using only queue operations (enqueue, dequeue, front, isEmpty). Support push, pop, top, and empty operations.
    
    EXAMPLE:
    Input: push(1), push(2), top(), pop(), empty()
    Output: 2, 2, false`,
    
      bruteForceComplexity: `Time Complexity: O(N) for push, O(1) for pop — using two queues
    Space Complexity: O(N)`,
    
      bruteForceCode: `class MyStack {
        Queue<Integer> q1 = new LinkedList<>();
        Queue<Integer> q2 = new LinkedList<>();
    
        public void push(int x) {
            q2.offer(x); // put new element in empty queue
            while (!q1.isEmpty()) { // move all old elements after it
                q2.offer(q1.poll());
            }
            Queue<Integer> temp = q1;
            q1 = q2;
            q2 = temp; // swap so q1 always holds the stack order
        }
    
        public int pop() {
            return q1.poll();
        }
    
        public int top() {
            return q1.peek();
        }
    
        public boolean empty() {
            return q1.isEmpty();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N) for push, O(1) for pop — using a single queue
    Space Complexity: O(N)`,
    
      optimalCode: `To maintain the Stack (LIFO) property, we use this for loop to move all previous elements behind 
      the newly added element, making it the front/top of the queue.
      
      class MyStack {
        Queue<Integer> q = new LinkedList<>();
    
        public void push(int x) {
            q.offer(x);
            int size = q.size();
            // rotate queue so newest element moves to front
            for (int i = 0; i < size - 1; i++) {
                q.offer(q.poll());
            }
        }
    
        public int pop() {
            return q.poll();
        }
    
        public int top() {
            return q.peek();
        }
    
        public boolean empty() {
            return q.isEmpty();
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given two arrays nums1 and nums2, where nums1 is a subset of nums2, find the next greater element for each element of nums1 in nums2. If it doesn't exist, output -1.
    
    EXAMPLE:
    Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
    Output: [-1,3,-1]`,
    
      bruteForceComplexity: `Time Complexity: O(N*M)
    Space Complexity: O(N) for the result`,
    
      bruteForceCode: `class Solution {
        public int[] nextGreaterElement(int[] nums1, int[] nums2) {
            int[] result = new int[nums1.length];
    
            for (int i = 0; i < nums1.length; i++) {
                int index = -1;
                for (int j = 0; j < nums2.length; j++) { // find nums1[i] in nums2
                    if (nums2[j] == nums1[i]) { index = j; break; }
                }
                int nextGreater = -1;
                for (int j = index + 1; j < nums2.length; j++) { // scan forward for greater element
                    if (nums2[j] > nums1[i]) { nextGreater = nums2[j]; break; }
                }
                result[i] = nextGreater;
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N+M)
    Space Complexity: O(M) for the map + stack`,
    
      optimalCode: `Traverse nums2 with a monotonic decreasing stack; whenever the current number is greater than the stack's top,
     it becomes the next greater element for all smaller elements popped from the stack, then answer each nums1 query using the constructed map.
      
      
      class Solution {
        public int[] nextGreaterElement(int[] nums1, int[] nums2) {
            Map<Integer, Integer> nextGreaterMap = new HashMap<>();
            Deque<Integer> stack = new ArrayDeque<>();
    
            // monotonic decreasing stack over nums2
            for (int num : nums2) {
                while (!stack.isEmpty() && stack.peek() < num) {
                    nextGreaterMap.put(stack.pop(), num);
                }
                stack.push(num);
            }
    
            int[] result = new int[nums1.length];
            for (int i = 0; i < nums1.length; i++) {
                result[i] = nextGreaterMap.getOrDefault(nums1[i], -1);
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Implement a queue using only stack operations (push, pop, top, empty). Support push, pop, peek, and empty operations.
    
    EXAMPLE:
    Input: push(1), push(2), peek(), pop(), empty()
    Output: 1, 1, false`,
    
      bruteForceComplexity: `Time Complexity: O(N) for push, O(1) for pop — using two stacks, always transferring on push
    Space Complexity: O(N)`,
    
      bruteForceCode: `class MyQueue {
        Deque<Integer> s1 = new ArrayDeque<>();
        Deque<Integer> s2 = new ArrayDeque<>();
    
        public void push(int x) {
            while (!s1.isEmpty()) s2.push(s1.pop()); // move everything out
            s1.push(x); // insert new element at bottom
            while (!s2.isEmpty()) s1.push(s2.pop()); // move everything back
        }
    
        public int pop() {
            return s1.pop();
        }
    
        public int peek() {
            return s1.peek();
        }
    
        public boolean empty() {
            return s1.isEmpty();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(1) amortized for push and pop
    Space Complexity: O(N)`,
    
      optimalCode: `class MyQueue {
        Deque<Integer> inStack = new ArrayDeque<>();
        Deque<Integer> outStack = new ArrayDeque<>();
    
        public void push(int x) {
            inStack.push(x); // O(1) always
        }
    
        public int pop() {
            transfer();
            return outStack.pop();
        }
    
        public int peek() {
            transfer();
            return outStack.peek();
        }
    
        public boolean empty() {
            return inStack.isEmpty() && outStack.isEmpty();
        }
    
        // only moves elements when outStack is empty -> amortized O(1)
        private void transfer() {
            if (outStack.isEmpty()) {
                while (!inStack.isEmpty()) outStack.push(inStack.pop());
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid (every bracket is closed by the same type, in the correct order).
    
    EXAMPLE:
    Input: s = "()[]{}"
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — repeatedly removes matched adjacent pairs
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean isValid(String s) {
            StringBuilder sb = new StringBuilder(s);
            boolean changed = true;
    
            while (changed) { // keep removing matched pairs until no more changes
                changed = false;
                for (int i = 0; i < sb.length() - 1; i++) {
                    char a = sb.charAt(i), b = sb.charAt(i + 1);
                    if ((a == '(' && b == ')') || (a == '{' && b == '}') || (a == '[' && b == ']')) {
                        sb.delete(i, i + 2);
                        changed = true;
                        break;
                    }
                }
            }
            return sb.length() == 0;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public boolean isValid(String s) {
            Deque<Character> stack = new ArrayDeque<>();
            Map<Character, Character> pairs = Map.of(')', '(', '}', '{', ']', '[');   // its a key value pair(key-')' it's value '(' ) like this for each
    
            for (char c : s.toCharArray()) {
                if (!pairs.containsKey(c)) {
                    stack.push(c); // opening bracket
                } else {
                    if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
                }
            }
            return stack.isEmpty();
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a stream of characters, find the first non-repeating character at every point when a new character is added to the stream.
    
    EXAMPLE:
    Input: stream = "aabc"
    Output: "a a b b"  (after 'a': a, after 'a': a repeats so still a until removed -> a, after 'b': b, after 'c': b)`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — rescans the whole stream for each new character
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public String firstNonRepeating(String stream) {
            StringBuilder result = new StringBuilder();
    
            for (int i = 0; i < stream.length(); i++) {
                String prefix = stream.substring(0, i + 1);
                char[] freq = new char[256];
                for (char c : prefix.toCharArray()) freq[c]++; // count frequency from scratch
    
                char firstNonRepeat = '#';
                for (char c : prefix.toCharArray()) { // find first char with freq 1
                    if (freq[c] == 1) { firstNonRepeat = c; break; }
                }
                result.append(firstNonRepeat);
            }
            return result.toString();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public String firstNonRepeating(String stream) {
            StringBuilder result = new StringBuilder();
            int[] freq = new int[256];
            Queue<Character> queue = new LinkedList<>();
    
            for (char c : stream.toCharArray()) {
                freq[c]++;
                queue.offer(c);
    
                // remove repeating chars from front of queue
                while (!queue.isEmpty() && freq[queue.peek()] > 1) {
                    queue.poll();
                }
    
                result.append(queue.isEmpty() ? '#' : queue.peek());
            }
            return result.toString();
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a queue of integers and a positive integer k, reverse the order of the first k elements of the queue, leaving the rest of the queue in the same relative order.
    
    EXAMPLE:
    Input: queue = [1,2,3,4,5], k = 3
    Output: [3,2,1,4,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N) — using an auxiliary array to reverse the first k
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public Queue<Integer> reverseFirstK(Queue<Integer> queue, int k) {
            int[] arr = new int[k];
            for (int i = 0; i < k; i++) { // extract first k into array
                arr[i] = queue.poll();
            }
    
            for (int i = 0, j = k - 1; i < j; i++, j--) { // reverse array
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
    
            Queue<Integer> newQueue = new LinkedList<>();
            for (int val : arr) newQueue.offer(val); // reversed first k
            while (!queue.isEmpty()) newQueue.offer(queue.poll()); // rest unchanged
    
            return newQueue;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(k) — uses a stack instead of an extra queue`,
    
      optimalCode: `class Solution {
        public Queue<Integer> reverseFirstK(Queue<Integer> queue, int k) {
            Deque<Integer> stack = new ArrayDeque<>();
    
            for (int i = 0; i < k; i++) { // push first k elements onto stack
                stack.push(queue.poll());
            }
            while (!stack.isEmpty()) { // pop back into queue -> reversed order
                queue.offer(stack.pop());
            }
    
            int remaining = queue.size() - k;
            for (int i = 0; i < remaining; i++) { // rotate rest to preserve original relative order
                queue.offer(queue.poll());
            }
    
            return queue;
        }
    }`
    },

    {
      title: `QUESTION:
    There are n people in a line to buy tickets, where the 0th person is at the front. Given an integer array tickets of length n, where tickets[i] is the number of tickets that person i wants to buy, and a position k, return the time taken for the person at position k to finish buying tickets (each person buys 1 ticket at a time, then goes to the back of the line if they still need more).
    
    EXAMPLE:
    Input: tickets = [2,3,2], k = 2
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: O(sum(tickets)) — actually simulates the queue with a real Queue data structure
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int timeRequiredToBuy(int[] tickets, int k) {
            Queue<Integer> indices = new LinkedList<>();
            for (int i = 0; i < tickets.length; i++) indices.offer(i); // simulate actual line
    
            int time = 0;
            while (!indices.isEmpty()) {
                int idx = indices.poll();
                tickets[idx]--; // buy one ticket
                time++;
    
                if (idx == k && tickets[idx] == 0) return time; // target person done
                if (tickets[idx] > 0) indices.offer(idx); // go to back of line
            }
            return time;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `Each person before or at index k can buy at most tickets[k] tickets before person k finishes, while each person after k can buy at most
     tickets[k] - 1 tickets because person k finishes before they get one final turn.
      
      
      class Solution {
        public int timeRequiredToBuy(int[] tickets, int k) {
            int time = 0;
            for (int i = 0; i < tickets.length; i++) {
                if (i <= k) {
                    // people at or before k buy up to tickets[k] tickets (or all of theirs if fewer)
                    time += Math.min(tickets[i], tickets[k]);
                } else {
                    // people after k only get one extra round before k finishes
                    time += Math.min(tickets[i], tickets[k] - 1);
                }
            }
            return time;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Design a data structure that follows Least Recently Used (LRU) cache eviction policy. Implement get(key) and put(key, value) both in O(1) time. Capacity is fixed.
    
    EXAMPLE:
    Input: capacity = 2, put(1,1), put(2,2), get(1), put(3,3) [evicts 2], get(2)
    Output: get(1) = 1, get(2) = -1`,
    
      bruteForceComplexity: `Time Complexity: O(N) for get and put — using a LinkedHashMap-like linear scan or ArrayList
    Space Complexity: O(N)`,
    
      bruteForceCode: `class LRUCache {
        private List<int[]> cache; // each entry: [key, value], order = recency (front = most recent)
        private int capacity;
    
        public LRUCache(int capacity) {
            this.capacity = capacity;
            this.cache = new ArrayList<>();
        }
    
        public int get(int key) {
            for (int i = 0; i < cache.size(); i++) { // linear scan to find key
                if (cache.get(i)[0] == key) {
                    int[] entry = cache.remove(i);
                    cache.add(0, entry); // move to front (most recently used)
                    return entry[1];
                }
            }
            return -1;
        }
    
        public void put(int key, int value) {
            for (int i = 0; i < cache.size(); i++) { // check if key exists
                if (cache.get(i)[0] == key) {
                    cache.remove(i);
                    break;
                }
            }
            if (cache.size() == capacity) {
                cache.remove(cache.size() - 1); // evict least recently used (last)
            }
            cache.add(0, new int[]{key, value});
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(1) for both get and put
    Space Complexity: O(capacity)`,
    
      optimalCode: `class LRUCache {
        class Node {
            int key, value;
            Node prev, next;
            Node(int k, int v) { key = k; value = v; }
        }
    
        private Map<Integer, Node> map;
        private Node head, tail; // dummy head/tail for doubly linked list
        private int capacity;
    
        public LRUCache(int capacity) {
            this.capacity = capacity;
            this.map = new HashMap<>();
            head = new Node(-1, -1);
            tail = new Node(-1, -1);
            head.next = tail;
            tail.prev = head;
        }
    
        public int get(int key) {
            if (!map.containsKey(key)) return -1;
            Node node = map.get(key);
            remove(node);
            insertAtFront(node); // mark as most recently used
            return node.value;
        }
    
        public void put(int key, int value) {
            if (map.containsKey(key)) {
                remove(map.get(key));
            }
            if (map.size() == capacity) {
                Node lru = tail.prev; // least recently used = right before tail
                remove(lru);
                map.remove(lru.key);
            }
            Node newNode = new Node(key, value);
            insertAtFront(newNode);
            map.put(key, newNode);
        }
    
        private void remove(Node node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
    
        private void insertAtFront(Node node) {
            node.next = head.next;
            node.prev = head;
            head.next.prev = node;
            head.next = node;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
    
    EXAMPLE:
    Input: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()
    Output: -3, 0, -2`,
    
      bruteForceComplexity: `Time Complexity: O(N) for getMin — scans the whole stack each time
    Space Complexity: O(N)`,
    
      bruteForceCode: `class MinStack {
        private Deque<Integer> stack;
    
        public MinStack() {
            stack = new ArrayDeque<>();
        }
    
        public void push(int val) {
            stack.push(val);
        }
    
        public void pop() {
            stack.pop();
        }
    
        public int top() {
            return stack.peek();
        }
    
        public int getMin() {
            int min = Integer.MAX_VALUE;
            for (int val : stack) { // linear scan every call
                min = Math.min(min, val);
            }
            return min;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(1) for all operations
    Space Complexity: O(N) — auxiliary min stack`,
    
      optimalCode: `class MinStack {
        private Deque<Integer> stack;
        private Deque<Integer> minStack; // tracks minimum at each level
    
        public MinStack() {
            stack = new ArrayDeque<>();
            minStack = new ArrayDeque<>();
        }
    
        public void push(int val) {
            stack.push(val);
            // push current min (either val or existing min) onto minStack
            int currentMin = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
            minStack.push(currentMin);
        }
    
        public void pop() {
            stack.pop();
            minStack.pop();
        }
    
        public int top() {
            return stack.peek();
        }
    
        public int getMin() {
            return minStack.peek(); // O(1) lookup
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a circular integer array nums, return the next greater number for every element. The next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return -1.
    
    EXAMPLE:
    Input: nums = [1,2,1]
    Output: [2,-1,2]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each element, scans up to 2N elements circularly
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int[] nextGreaterElements(int[] nums) {
            int n = nums.length;
            int[] result = new int[n];
    
            for (int i = 0; i < n; i++) {
                int nextGreater = -1;
                for (int j = 1; j < n; j++) { // scan circularly starting from i+1
                    int idx = (i + j) % n;
                    if (nums[idx] > nums[i]) {
                        nextGreater = nums[idx];
                        break;
                    }
                }
                result[i] = nextGreater;
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N)`,
    
      optimalCode: `Use a monotonic decreasing stack of indices and traverse the array twice (2*n iterations) to simulate circularity; during the
     second pass, only resolve pending indices without pushing new ones.
     Keep smaller numbers waiting in a stack until a bigger number comes; when a bigger number arrives, 
     it becomes the answer for all those smaller numbers.
      
      class Solution {
        public int[] nextGreaterElements(int[] nums) {
            int n = nums.length;
            int[] result = new int[n];
            Arrays.fill(result, -1);
            Deque<Integer> stack = new ArrayDeque<>(); // stores indices
    
            // traverse array twice to simulate circularity, using a monotonic decreasing stack
            for (int i = 0; i < 2 * n; i++) {
                int num = nums[i % n];
                while (!stack.isEmpty() && nums[stack.peek()] < num) {
                    result[stack.pop()] = num;
                }
                if (i < n) stack.push(i); // only push indices during first pass
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    In a party of N people, only one person is known to everyone (the celebrity). This person knows nobody, but everybody knows them. Given a matrix M where M[i][j] = 1 means person i knows person j, find the celebrity (return their index, or -1 if none exists).
    
    EXAMPLE:
    Input: M = [[0,1,0],[0,0,0],[0,1,0]]
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — checks every candidate against everyone
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int findCelebrity(int[][] M, int n) {
            for (int candidate = 0; candidate < n; candidate++) {
                boolean isCelebrity = true;
    
                for (int other = 0; other < n; other++) {
                    if (candidate == other) continue;
                    // celebrity knows nobody, and everybody knows the celebrity
                    if (M[candidate][other] == 1 || M[other][candidate] == 0) {
                        isCelebrity = false;
                        break;
                    }
                }
                if (isCelebrity) return candidate;
            }
            return -1;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N) — elimination via stack, then O(N) verification
    Space Complexity: O(N) for the stack`,
    
      optimalCode: `class Solution {
        public int findCelebrity(int[][] M, int n) {
            Deque<Integer> stack = new ArrayDeque<>();
            for (int i = 0; i < n; i++) stack.push(i);
    
            // eliminate one candidate per comparison until one remains
            while (stack.size() > 1) {
                int a = stack.pop();
                int b = stack.pop();
    
                if (M[a][b] == 1) {
                    // a knows b, so a can't be celebrity
                    stack.push(b);
                } else {
                    // a doesn't know b, so b can't be celebrity
                    stack.push(a);
                }
            }
    
            int candidate = stack.pop();
    
            // verify candidate: knows nobody, known by everybody
            for (int other = 0; other < n; other++) {
                if (other == candidate) continue;
                if (M[candidate][other] == 1 || M[other][candidate] == 0) return -1;
            }
            return candidate;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a stack of integers, sort it in ascending order (with the smallest on top) using only stack operations (push, pop, peek, isEmpty). No other data structure like arrays is allowed, except one additional stack.
    
    EXAMPLE:
    Input: stack = [34,3,31,98,92,23]
    Output: [3,23,31,34,92,98]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) but with heavy constant overhead — repeatedly finds and extracts the max via full pass, one at a time
    Space Complexity: O(N) for the result stack`,
    
      bruteForceCode: `class Solution {
        public Deque<Integer> sortStack(Deque<Integer> input) {
            Deque<Integer> result = new ArrayDeque<>();
            int size = input.size();
    
            for (int i = 0; i < size; i++) { // repeat 'size' times: find current max and move it
                int max = Integer.MIN_VALUE;
                Deque<Integer> temp = new ArrayDeque<>();
    
                while (!input.isEmpty()) { // find max by popping everything out
                    int val = input.pop();
                    if (val > max) max = val;
                    temp.push(val);
                }
                boolean placed = false;
                while (!temp.isEmpty()) { // put everything back except the max
                    int val = temp.pop();
                    if (val == max && !placed) { placed = true; continue; }
                    input.push(val);
                }
                result.push(max); // largest values pushed first, so smallest ends on top
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N^2)
    Space Complexity: O(N) — one auxiliary stack`,
    
      optimalCode: `class Solution {
        public Deque<Integer> sortStack(Deque<Integer> input) {
            Deque<Integer> tempStack = new ArrayDeque<>();
    
            while (!input.isEmpty()) {
                int temp = input.pop();
    
                // move elements from tempStack back to input while they're smaller than temp
                while (!tempStack.isEmpty() && tempStack.peek() > temp) {
                    input.push(tempStack.pop());
                }
                tempStack.push(temp); // tempStack stays sorted (descending, top = smallest... actually ascending bottom-to-top)
            }
    
            // tempStack now holds sorted values with smallest on top after reversal
            while (!tempStack.isEmpty()) {
                input.push(tempStack.pop());
            }
            return input;
        }
    }`
    },
    
    {
      title: `QUESTION:
    The stock span problem: for each day, given the stock's price, calculate the span of that stock's price, defined as the maximum number of consecutive days (including today) the price of the stock was less than or equal to today's price.
    
    EXAMPLE:
    Input: prices = [100,80,60,70,60,75,85]
    Output: [1,1,1,2,1,4,6]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each day, scans backward until a higher price is found
    Space Complexity: O(N) for the result`,
    
      bruteForceCode: `class Solution {
        public int[] calculateSpan(int[] prices) {
            int n = prices.length;
            int[] span = new int[n];
    
            for (int i = 0; i < n; i++) {
                int count = 1;
                int j = i - 1;
                while (j >= 0 && prices[j] <= prices[i]) { // scan backward day by day
                    count++;
                    j--;
                }
                span[i] = count;
            }
            return span;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) for the stack`,
    
      optimalCode: `class Solution {
        public int[] calculateSpan(int[] prices) {
            int n = prices.length;
            int[] span = new int[n];
            Deque<Integer> stack = new ArrayDeque<>(); // stores indices, monotonic decreasing prices
    
            for (int i = 0; i < n; i++) {
                while (!stack.isEmpty() && prices[stack.peek()] <= prices[i]) {
                    stack.pop(); // pop all days with price <= today's price
                }
                span[i] = stack.isEmpty() ? (i + 1) : (i - stack.peek());
                stack.push(i);
            }
            return span;
        }
    }`
    },
    
    {
      title: `QUESTION:
    There are n gas stations along a circular route, where gas[i] is the amount of gas at station i, and cost[i] is the cost of gas to travel from station i to station i+1. Return the starting gas station's index if you can travel around the circuit once, otherwise return -1. (Assume a unique solution exists if one is possible.)
    
    EXAMPLE:
    Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — tries every starting point and simulates the full circular trip
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int canCompleteCircuit(int[] gas, int[] cost) {
            int n = gas.length;
    
            for (int start = 0; start < n; start++) { // try every starting station
                int tank = 0;
                boolean canComplete = true;
    
                for (int i = 0; i < n; i++) { // simulate the full circular trip from 'start'
                    int idx = (start + i) % n;
                    tank += gas[idx] - cost[idx];
                    if (tank < 0) {
                        canComplete = false;
                        break;
                    }
                }
                if (canComplete) return start;
            }
            return -1;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1)`,
    
      optimalCode: `  //here totalTank makes sure that if it is >=0 then from that station we can reach every other station
      as it is calculating sum of (gas[i]-cost[i]) got it 
      
      class Solution {
        public int canCompleteCircuit(int[] gas, int[] cost) {
            int totalTank = 0, currTank = 0, start = 0;
    
            for (int i = 0; i < gas.length; i++) {
                int diff = gas[i] - cost[i];
                totalTank += diff;                
                currTank += diff;
    
                if (currTank < 0) { // can't reach next station from current start
                    start = i + 1;  // reset start candidate
                    currTank = 0;
                }
            }
    
            return totalTank >= 0 ? start : -1; // total gas covers total cost -> a solution exists
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array of integers heights representing the histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.
    
    EXAMPLE:
    Input: heights = [2,1,5,6,2,3]
    Output: 10`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each bar, expands left and right to find the boundary
    Space Complexity: O(1)`,
    
      bruteForceCode: `class Solution {
        public int largestRectangleArea(int[] heights) {
            int n = heights.length;
            int maxArea = 0;
    
            for (int i = 0; i < n; i++) {
                int minHeight = heights[i];
                for (int j = i; j < n; j++) { // expand right, tracking the minimum height in range
                    minHeight = Math.min(minHeight, heights[j]);
                    int width = j - i + 1;
                    maxArea = Math.max(maxArea, minHeight * width);
                }
            }
            return maxArea;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) for the stack`,
    
      optimalCode: `class Solution {
        public int largestRectangleArea(int[] heights) {
            Deque<Integer> stack = new ArrayDeque<>(); // stores indices, monotonic increasing heights
            int maxArea = 0;
            int n = heights.length;
    
            for (int i = 0; i <= n; i++) {
                int currHeight = (i == n) ? 0 : heights[i]; // sentinel 0 to flush remaining stack at end
    
                while (!stack.isEmpty() && heights[stack.peek()] >= currHeight) {
                    int height = heights[stack.pop()];
                    int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                    maxArea = Math.max(maxArea, height * width);
                }
                stack.push(i);
            }
            return maxArea;
        }
    }`
    },

  ],


  "bt-&-bst":[

    {
      title: `QUESTION:
    Given the root of a binary tree, return the preorder traversal of its nodes' values (Root -> Left -> Right).
    
    EXAMPLE:
    Input: root = [1,null,2,3]
    Output: [1,2,3]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — recursion stack (O(H) for height, worst case O(N) for skewed tree)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> preorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            traverse(root, result);
            return result;
        }
    
        private void traverse(TreeNode node, List<Integer> result) {
            if (node == null) return;
            result.add(node.val); // visit root first
            traverse(node.left, result);
            traverse(node.right, result);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) extra — Morris traversal, no stack or recursion`,
    
      optimalCode: `class Solution {
        public List<Integer> preorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            TreeNode curr = root;
    
            while (curr != null) {
                if (curr.left == null) {
                    result.add(curr.val);
                    curr = curr.right;
                } else {
                    // find inorder predecessor (rightmost node in left subtree)
                    TreeNode pred = curr.left;
                    while (pred.right != null && pred.right != curr) pred = pred.right;
    
                    if (pred.right == null) {
                        result.add(curr.val); // visit before going left (preorder)
                        pred.right = curr;    // create temporary thread
                        curr = curr.left;
                    } else {
                        pred.right = null; // remove thread, already visited
                        curr = curr.right;
                    }
                }
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).
    
    EXAMPLE:
    Input: root = [3,9,20,null,null,15,7]
    Output: [[3],[9,20],[15,7]]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — computes tree height first, then does a separate pass per level
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
            public List<List<Integer>> levelOrder(TreeNode root) {
                List<List<Integer>> result = new ArrayList<>();
                if (root == null) return result;

                Queue<TreeNode> nodeQueue = new LinkedList<>();
                Queue<Integer> levelQueue = new LinkedList<>();

                nodeQueue.offer(root);
                levelQueue.offer(0);

                while (!nodeQueue.isEmpty()) {
                    TreeNode node = nodeQueue.poll();
                    int level = levelQueue.poll();

                    // if this is the first node we've seen at this level, create a new list
                    if (level == result.size()) {
                        result.add(new ArrayList<>());
                    }
                    result.get(level).add(node.val);

                    if (node.left != null) {
                        nodeQueue.offer(node.left);
                        levelQueue.offer(level + 1);
                    }
                    if (node.right != null) {
                        nodeQueue.offer(node.right);
                        levelQueue.offer(level + 1);
                    }
                }
                return result;
            }
        }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — queue holds at most one level's worth of nodes`,
    
      optimalCode: `class Solution {
        public List<List<Integer>> levelOrder(TreeNode root) {
            List<List<Integer>> result = new ArrayList<>();
            if (root == null) return result;
    
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
    
            while (!queue.isEmpty()) {
                int size = queue.size(); // number of nodes at current level
                List<Integer> currentLevel = new ArrayList<>();
    
                for (int i = 0; i < size; i++) {
                    TreeNode node = queue.poll();
                    currentLevel.add(node.val);
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
                result.add(currentLevel);
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the inorder traversal of its nodes' values (Left -> Root -> Right).
    
    EXAMPLE:
    Input: root = [1,null,2,3]
    Output: [1,3,2]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — recursion stack`,
    
      bruteForceCode: `class Solution {
        public List<Integer> inorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            traverse(root, result);
            return result;
        }
    
        private void traverse(TreeNode node, List<Integer> result) {
            if (node == null) return;
            traverse(node.left, result);
            result.add(node.val); // visit root between left and right
            traverse(node.right, result);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) extra — Morris traversal, no stack or recursion`,
    
      optimalCode: `class Solution {
        public List<Integer> inorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            TreeNode curr = root;
    
            while (curr != null) {
                if (curr.left == null) {
                    result.add(curr.val);
                    curr = curr.right;
                } else {
                    TreeNode pred = curr.left;
                    while (pred.right != null && pred.right != curr) pred = pred.right;
    
                    if (pred.right == null) {
                        pred.right = curr; // create temporary thread
                        curr = curr.left;
                    } else {
                        pred.right = null; // remove thread
                        result.add(curr.val); // visit after left subtree done (inorder)
                        curr = curr.right;
                    }
                }
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a Binary Search Tree, return the minimum absolute difference between the values of any two different nodes in the tree.
    
    EXAMPLE:
    Input: root = [4,2,6,1,3]
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — compares every pair of node values
    Space Complexity: O(N) for storing all values`,
    
      bruteForceCode: `class Solution {
        public int minDiffInBST(TreeNode root) {
            List<Integer> values = new ArrayList<>();
            collect(root, values);
    
            int minDiff = Integer.MAX_VALUE;
            for (int i = 0; i < values.size(); i++) { // compare every pair
                for (int j = i + 1; j < values.size(); j++) {
                    minDiff = Math.min(minDiff, Math.abs(values.get(i) - values.get(j)));
                }
            }
            return minDiff;
        }
    
        private void collect(TreeNode node, List<Integer> values) {
            if (node == null) return;
            values.add(node.val);
            collect(node.left, values);
            collect(node.right, values);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) — recursion stack, H = tree height`,
    
      optimalCode: `
      class Solution {
        private TreeNode prev = null;
        private int minDiff = Integer.MAX_VALUE;
    
        public int minDiffInBST(TreeNode root) {
            inorder(root);
            return minDiff;
        }
    
        // inorder traversal of a BST visits nodes in sorted order,
        // so the minimum difference must occur between adjacent visited nodes
        private void inorder(TreeNode node) {   // node = 4
            if (node == null) return;           // 4 != null, continue
            inorder(node.left);                 // → calls inorder(2)

            if (prev != null) {                 // prev is null → skip
                minDiff = Math.min(minDiff, node.val - prev.val);
            }
            prev = node;                        // prev = node(1)

            inorder(node.right);                // → calls inorder(null)
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).
    
    EXAMPLE:
    Input: root = [1,2,2,3,4,4,3]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — builds a mirrored copy of the tree, then compares node by node with re-traversal
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean isSymmetric(TreeNode root) {
            if (root == null) return true;
            TreeNode mirrored = buildMirror(root);
            return isSameTree(root, mirrored); // separate full traversal to compare
        }
    
        private TreeNode buildMirror(TreeNode node) {
            if (node == null) return null;
            TreeNode newNode = new TreeNode(node.val);
            newNode.left = buildMirror(node.right); // swap children while copying
            newNode.right = buildMirror(node.left);
            return newNode;
        }
    
        private boolean isSameTree(TreeNode a, TreeNode b) {
            if (a == null && b == null) return true;
            if (a == null || b == null || a.val != b.val) return false;
            return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) — recursion stack, H = tree height`,
    
      optimalCode: `class Solution {
        public boolean isSymmetric(TreeNode root) {
            if (root == null) return true;
            return isMirror(root.left, root.right); // compare directly, no extra tree built
        }
    
        private boolean isMirror(TreeNode left, TreeNode right) {
            if (left == null && right == null) return true;
            if (left == null || right == null || left.val != right.val) return false;
    
            // left's left must mirror right's right, and vice versa
            return isMirror(left.left, right.right) && isMirror(left.right, right.left);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the postorder traversal of its nodes' values (Left -> Right -> Root).
    
    EXAMPLE:
    Input: root = [1,null,2,3]
    Output: [3,2,1]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — recursion stack`,
    
      bruteForceCode: `class Solution {
        public List<Integer> postorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            traverse(root, result);
            return result;
        }
    
        private void traverse(TreeNode node, List<Integer> result) {
            if (node == null) return;
            traverse(node.left, result);
            traverse(node.right, result);
            result.add(node.val); // visit root last
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) extra — Morris-based postorder traversal, no stack or recursion`,
    
      optimalCode: `class Solution {
        public List<Integer> postorderTraversal(TreeNode root) {
            LinkedList<Integer> result = new LinkedList<>();
            TreeNode curr = root;
    
            // Morris preorder on (root, right, left), then reverse -> postorder
            while (curr != null) {
                if (curr.right == null) {
                    result.addFirst(curr.val); // build result in reverse
                    curr = curr.left;
                } else {
                    TreeNode pred = curr.right;
                    while (pred.left != null && pred.left != curr) pred = pred.left;
    
                    if (pred.left == null) {
                        result.addFirst(curr.val);
                        pred.left = curr; // create temporary thread
                        curr = curr.right;
                    } else {
                        pred.left = null; // remove thread
                        curr = curr.left;
                    }
                }
            }
            return result;
        }
    }`
    },

    {
      title: `QUESTION:
    Given the root of a binary tree, return the inorder traversal using Morris Traversal (O(1) extra space, no recursion or stack).
    
    EXAMPLE:
    Input: root = [1,null,2,3]
    Output: [1,3,2]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — uses an explicit stack to simulate recursion`,
    
      bruteForceCode: `class Solution {
        public List<Integer> inorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            Deque<TreeNode> stack = new ArrayDeque<>();
            TreeNode curr = root;
    
            while (curr != null || !stack.isEmpty()) {
                while (curr != null) { // push all left nodes
                    stack.push(curr);
                    curr = curr.left;
                }
                curr = stack.pop();
                result.add(curr.val);
                curr = curr.right;
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) extra — Morris Traversal, no stack or recursion`,
    
      optimalCode: `class Solution {
        public List<Integer> inorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            TreeNode curr = root;
    
            while (curr != null) {
                if (curr.left == null) {
                    result.add(curr.val);
                    curr = curr.right;
                } else {
                    // find inorder predecessor (rightmost node in left subtree)
                    TreeNode pred = curr.left;
                    while (pred.right != null && pred.right != curr) pred = pred.right;
    
                    if (pred.right == null) {
                        pred.right = curr; // create temporary thread back to curr
                        curr = curr.left;
                    } else {
                        pred.right = null; // remove thread, left subtree already visited
                        result.add(curr.val);
                        curr = curr.right;
                    }
                }
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the length of the diameter of the tree (the length of the longest path between any two nodes, measured in number of edges; this path may or may not pass through the root).
    
    EXAMPLE:
    Input: root = [1,2,3,4,5]
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each node, recomputes height of its subtrees independently
    Space Complexity: O(H) recursion stack`,
    
      bruteForceCode: `class Solution {
        int maxDiameter = 0;
    
        public int diameterOfBinaryTree(TreeNode root) {
            computeDiameter(root);
            return maxDiameter;
        }
    
        private void computeDiameter(TreeNode node) {
            if (node == null) return;
            int leftHeight = height(node.left); // recomputes height from scratch each call
            int rightHeight = height(node.right);
            maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);
    
            computeDiameter(node.left);
            computeDiameter(node.right);
        }
    
        private int height(TreeNode node) {
            if (node == null) return 0;
            return 1 + Math.max(height(node.left), height(node.right));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        int maxDiameter = 0;
    
        public int diameterOfBinaryTree(TreeNode root) {
            height(root);
            return maxDiameter;
        }
    
        // single pass: compute height and update diameter simultaneously
        private int height(TreeNode node) {
            if (node == null) return 0;
            int leftHeight = height(node.left);
            int rightHeight = height(node.right);
    
            maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);
    
            return 1 + Math.max(leftHeight, rightHeight);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the roots of two binary trees p and q, check if they are the same tree (structurally identical and nodes have the same value).
    
    EXAMPLE:
    Input: p = [1,2,3], q = [1,2,3]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N) but with extra overhead — serializes both trees into strings then compares
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean isSameTree(TreeNode p, TreeNode q) {
            String s1 = serialize(p);
            String s2 = serialize(q);
            return s1.equals(s2); // compares full serialized representations
        }
    
        private String serialize(TreeNode node) {
            if (node == null) return "null,";
            return node.val + "," + serialize(node.left) + serialize(node.right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        public boolean isSameTree(TreeNode p, TreeNode q) {
            if (p == null && q == null) return true;
            if (p == null || q == null || p.val != q.val) return false;
    
            return isSameTree(p.left, q.left) && isSameTree(p.right, q.right); // direct comparison, no strings
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, check whether it is a mirror of itself (symmetric around its center).
    
    EXAMPLE:
    Input: root = [1,2,2,3,4,4,3]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — builds a mirrored copy of the tree, then compares node by node
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean isSymmetric(TreeNode root) {
            if (root == null) return true;
            TreeNode mirrored = buildMirror(root);
            return isSameTree(root, mirrored); // separate comparison after building full mirror
        }
    
        private TreeNode buildMirror(TreeNode node) {
            if (node == null) return null;
            TreeNode newNode = new TreeNode(node.val);
            newNode.left = buildMirror(node.right);
            newNode.right = buildMirror(node.left);
            return newNode;
        }
    
        private boolean isSameTree(TreeNode a, TreeNode b) {
            if (a == null && b == null) return true;
            if (a == null || b == null || a.val != b.val) return false;
            return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        public boolean isSymmetric(TreeNode root) {
            if (root == null) return true;
            return isMirror(root.left, root.right); // compare directly, no extra tree
        }
    
        private boolean isMirror(TreeNode left, TreeNode right) {
            if (left == null && right == null) return true;
            if (left == null || right == null || left.val != right.val) return false;
    
            return isMirror(left.left, right.right) && isMirror(left.right, right.left);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot.
    
    EXAMPLE:
    Input: root = [3,4,5,1,2], subRoot = [4,1,2]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N*M) — serializes both trees to strings and searches naively, or compares subtree at every node from scratch
    Space Complexity: O(N+M)`,
    
      bruteForceCode: `class Solution {
        public boolean isSubtree(TreeNode root, TreeNode subRoot) {
            if (root == null) return subRoot == null;
    
            // check every single node in root as a possible match, full comparison each time
            if (isSameTree(root, subRoot)) return true;
    
            return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
        }
    
        private boolean isSameTree(TreeNode a, TreeNode b) {
            if (a == null && b == null) return true;
            if (a == null || b == null || a.val != b.val) return false;
            return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N+M) — via serialization + KMP/string-matching (or O(N*M) with tree comparison but pruned early with hashing)
    Space Complexity: O(N+M)`,
    
      optimalCode: `class Solution {
        public boolean isSubtree(TreeNode root, TreeNode subRoot) {
            StringBuilder rootStr = new StringBuilder();
            StringBuilder subStr = new StringBuilder();
            serialize(root, rootStr);
            serialize(subRoot, subStr);
    
            // single substring search instead of repeated full-tree comparisons
            return rootStr.toString().contains(subStr.toString());
        }
    
        // include null markers and a delimiter to avoid false positives (e.g. "12" containing "2")
        private void serialize(TreeNode node, StringBuilder sb) {
            if (node == null) {
                sb.append(",#");
                return;
            }
            sb.append(",").append(node.val);
            serialize(node.left, sb);
            serialize(node.right, sb);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, determine if it is height-balanced (the depths of the two subtrees of every node never differ by more than 1).
    
    EXAMPLE:
    Input: root = [3,9,20,null,null,15,7]
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each node, recomputes height of its subtrees independently
    Space Complexity: O(H) recursion stack`,
    
      bruteForceCode: `class Solution {
        public boolean isBalanced(TreeNode root) {
            if (root == null) return true;
    
            int leftHeight = height(root.left); // recomputes height from scratch each call
            int rightHeight = height(root.right);
    
            if (Math.abs(leftHeight - rightHeight) > 1) return false;
    
            return isBalanced(root.left) && isBalanced(root.right);
        }
    
        private int height(TreeNode node) {
            if (node == null) return 0;
            return 1 + Math.max(height(node.left), height(node.right));
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        public boolean isBalanced(TreeNode root) {
            return checkHeight(root) != -1;
        }
    
        // single pass: returns height if balanced, or -1 as a sentinel if unbalanced
        // and short-circuits immediately once imbalance is detected
        private int checkHeight(TreeNode node) {
            if (node == null) return 0;
    
            int leftHeight = checkHeight(node.left);
            if (leftHeight == -1) return -1; // early exit
    
            int rightHeight = checkHeight(node.right);
            if (rightHeight == -1) return -1; // early exit
    
            if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    
            return 1 + Math.max(leftHeight, rightHeight);
        }
    }`
    },

    {
      title: `QUESTION:
    Given the root of a binary tree, return the bottom view of the tree — the set of nodes visible when the tree is viewed from below, ordered by their horizontal distance from the root (left to right).
    
    EXAMPLE:
    Input: root = [20,8,22,5,3,4,25,null,null,10,14]
    Output: [5,10,4,14,25]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — for each horizontal distance, tracks the last node seen at that level via repeated map updates without proper level tracking (may overwrite with a higher node incorrectly in some traversal orders)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> bottomView(TreeNode root) {
            Map<Integer, Integer> hdMap = new TreeMap<>(); // horizontal distance -> value
            traverse(root, 0, hdMap);
            return new ArrayList<>(hdMap.values());
        }
    
        // plain preorder DFS (root, left, right) - later nodes at same HD overwrite earlier ones,
        // but without level tracking this can incorrectly favor a node visited later in DFS
        // even if it's actually higher up, so results can be wrong for certain tree shapes
        private void traverse(TreeNode node, int hd, Map<Integer, Integer> hdMap) {
            if (node == null) return;
            hdMap.put(hd, node.val); // always overwrite, no level comparison
            traverse(node.left, hd - 1, hdMap);
            traverse(node.right, hd + 1, hdMap);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — dominated by TreeMap operations
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<Integer> bottomView(TreeNode root) {
            if (root == null) return new ArrayList<>();
            TreeMap<Integer, Integer> hdMap = new TreeMap<>(); // sorted by horizontal distance
            Queue<TreeNode> queue = new LinkedList<>();
            Queue<Integer> hdQueue = new LinkedList<>();
    
            queue.offer(root);
            hdQueue.offer(0);
    
            // BFS ensures nodes are processed level by level, so later levels correctly overwrite earlier ones
            while (!queue.isEmpty()) {
                TreeNode node = queue.poll();
                int hd = hdQueue.poll();
    
                hdMap.put(hd, node.val); // last node at this HD (from deepest level) wins
    
                if (node.left != null) {
                    queue.offer(node.left);
                    hdQueue.offer(hd - 1);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                    hdQueue.offer(hd + 1);
                }
            }
            return new ArrayList<>(hdMap.values());
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the top view of the tree — the set of nodes visible when the tree is viewed from above, ordered by their horizontal distance from the root (left to right).
    
    EXAMPLE:
    Input: root = [1,2,3,4,5,6,7]
    Output: [4,2,1,3,7]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> topView(TreeNode root) {
            Map<Integer, Integer> hdMap = new TreeMap<>();
            Map<Integer, Integer> depthMap = new TreeMap<>(); // tracks min depth seen for each HD
    
            traverse(root, 0, 0, hdMap, depthMap);
            return new ArrayList<>(hdMap.values());
        }
    
        // DFS with manual depth tracking to decide whether to overwrite -
        // more bookkeeping than needed, since BFS naturally solves this
        private void traverse(TreeNode node, int hd, int depth, Map<Integer, Integer> hdMap, Map<Integer, Integer> depthMap) {
            if (node == null) return;
    
            if (!depthMap.containsKey(hd) || depth < depthMap.get(hd)) {
                depthMap.put(hd, depth);
                hdMap.put(hd, node.val);
            }
    
            traverse(node.left, hd - 1, depth + 1, hdMap, depthMap);
            traverse(node.right, hd + 1, depth + 1, hdMap, depthMap);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — dominated by TreeMap operations
    Space Complexity: O(N)`,
    
      optimalCode: `class Solution {
        public List<Integer> topView(TreeNode root) {
            if (root == null) return new ArrayList<>();
            TreeMap<Integer, Integer> hdMap = new TreeMap<>();
            Queue<TreeNode> queue = new LinkedList<>();
            Queue<Integer> hdQueue = new LinkedList<>();
    
            queue.offer(root);
            hdQueue.offer(0);
    
            // BFS: first node encountered at each HD is the topmost -> only insert if not already present
            while (!queue.isEmpty()) {
                TreeNode node = queue.poll();
                int hd = hdQueue.poll();
    
                if (!hdMap.containsKey(hd)) { // first (topmost) node at this HD wins
                    hdMap.put(hd, node.val);
                }
    
                if (node.left != null) {
                    queue.offer(node.left);
                    hdQueue.offer(hd - 1);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                    hdQueue.offer(hd + 1);
                }
            }
            return new ArrayList<>(hdMap.values());
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a binary tree and two nodes p and q, find their lowest common ancestor (LCA) — the lowest node in the tree that has both p and q as descendants.
    
    EXAMPLE:
    Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N) to find paths + O(H) to compare — but path storage adds overhead
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            List<TreeNode> pathP = new ArrayList<>();
            List<TreeNode> pathQ = new ArrayList<>();
    
            findPath(root, p, pathP, new ArrayList<>());
            findPath(root, q, pathQ, new ArrayList<>());
    
            TreeNode lca = null;
            int i = 0;
            while (i < pathP.size() && i < pathQ.size() && pathP.get(i) == pathQ.get(i)) {
                lca = pathP.get(i); // walk both paths together, last common node is LCA
                i++;
            }
            return lca;
        }
    
        private boolean findPath(TreeNode node, TreeNode target, List<TreeNode> result, List<TreeNode> current) {
            if (node == null) return false;
            current.add(node);
            if (node == target) {
                result.addAll(current);
                return true;
            }
            if (findPath(node.left, target, result, current) || findPath(node.right, target, result, current)) {
                return true;
            }
            current.remove(current.size() - 1); // backtrack
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            if (root == null || root == p || root == q) return root;
    
            TreeNode left = lowestCommonAncestor(root.left, p, q);
            TreeNode right = lowestCommonAncestor(root.right, p, q);
    
            if (left != null && right != null) return root; // p and q found in different subtrees
            return (left != null) ? left : right; // both in same subtree, or one/none found
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree and an integer k, return all node values at level k (root is at level 0).
    
    EXAMPLE:
    Input: root = [1,2,3,4,5,6,7], k = 2
    Output: [4,5,6,7]`,
    
      bruteForceComplexity: `Time Complexity: O(N) but with redundant traversal overhead — re-traverses from root for level checking
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> kthLevel(TreeNode root, int k) {
            List<Integer> result = new ArrayList<>();
            int height = getHeight(root);
    
            if (k > height) return result; // level doesn't exist
    
            collectAtLevel(root, k, result); // separate DFS pass just for level k
            return result;
        }
    
        private int getHeight(TreeNode node) {
            if (node == null) return -1;
            return 1 + Math.max(getHeight(node.left), getHeight(node.right));
        }
    
        private void collectAtLevel(TreeNode node, int level, List<Integer> result) {
            if (node == null) return;
            if (level == 0) {
                result.add(node.val);
                return;
            }
            collectAtLevel(node.left, level - 1, result);
            collectAtLevel(node.right, level - 1, result);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — queue holds at most one level's worth of nodes`,
    
      optimalCode: `class Solution {
        public List<Integer> kthLevel(TreeNode root, int k) {
            List<Integer> result = new ArrayList<>();
            if (root == null) return result;
    
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            int currentLevel = 0;
    
            // single BFS pass, stop as soon as target level is processed
            while (!queue.isEmpty()) {
                int size = queue.size();
    
                if (currentLevel == k) {
                    for (int i = 0; i < size; i++) {
                        result.add(queue.poll().val);
                    }
                    return result;
                }
    
                for (int i = 0; i < size; i++) {
                    TreeNode node = queue.poll();
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
                currentLevel++;
            }
            return result; // level k doesn't exist
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.
    
    EXAMPLE:
    Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
    Output: [3,9,20,null,null,15,7]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — linear search in inorder array to find root index each time
    Space Complexity: O(N^2) — creates new subarrays at every recursive call`,
    
      bruteForceCode: `class Solution {
        public TreeNode buildTree(int[] preorder, int[] inorder) {
            if (preorder.length == 0) return null;
    
            int rootVal = preorder[0];
            TreeNode root = new TreeNode(rootVal);
    
            int rootIndex = 0;
            for (int i = 0; i < inorder.length; i++) { // linear search for root in inorder
                if (inorder[i] == rootVal) { rootIndex = i; break; }
            }
    
            int[] leftInorder = Arrays.copyOfRange(inorder, 0, rootIndex);       // creates new arrays
            int[] rightInorder = Arrays.copyOfRange(inorder, rootIndex + 1, inorder.length);
            int[] leftPreorder = Arrays.copyOfRange(preorder, 1, rootIndex + 1);
            int[] rightPreorder = Arrays.copyOfRange(preorder, rootIndex + 1, preorder.length);
    
            root.left = buildTree(leftPreorder, leftInorder);
            root.right = buildTree(rightPreorder, rightInorder);
    
            return root;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — hashmap + recursion stack`,
    
      optimalCode: `Here basically we r 1t putting inorder elements in map and after that we r building tree with inorder list, 1st creating root node then 
      recurssion root.left and root.right and we r geeting that is this node has children or not using the index parameter(map inorder one) with using 
      condn that (start>end) return null that it 
      
      
      class Solution {
        private Map<Integer, Integer> inorderIndexMap = new HashMap<>();
        private int preIndex = 0;
    
        public TreeNode buildTree(int[] preorder, int[] inorder) {
            for (int i = 0; i < inorder.length; i++) { // O(1) lookup instead of linear search
                inorderIndexMap.put(inorder[i], i);
            }
            return build(preorder, 0, inorder.length - 1);
        }
    
        private TreeNode build(int[] preorder, int inStart, int inEnd) {
            if (inStart > inEnd) return null;
    
            int rootVal = preorder[preIndex++]; // next node in preorder is always the current root
            TreeNode root = new TreeNode(rootVal);
    
            int rootIndex = inorderIndexMap.get(rootVal); // O(1) lookup
    
            root.left = build(preorder, inStart, rootIndex - 1);   // no array copying, just index ranges
            root.right = build(preorder, rootIndex + 1, inEnd);
    
            return root;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, transform it into a "Sum Tree" where each node's new value is the sum of all values in its original left and right subtrees (leaf nodes become 0).
    
    EXAMPLE:
    Input: root = [10,-2,6,8,-4,7,5]
    Output: [20,4,12,0,0,0,0]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each node, sums its subtree via a separate full traversal
    Space Complexity: O(H) recursion stack`,
    
      bruteForceCode: `class Solution {
        public void toSumTree(TreeNode root) {
            if (root == null) return;
    
            int leftSum = sumTree(root.left);   // full traversal of left subtree
            int rightSum = sumTree(root.right); // full traversal of right subtree
    
            toSumTree(root.left);  // recurse to transform children too
            toSumTree(root.right);
    
            root.val = leftSum + rightSum; // uses ORIGINAL values since children haven't changed yet... 
            // but this actually mutates children before capturing original sums in a naive order,
            // so sums must be captured before recursing, as shown above
        }
    
        private int sumTree(TreeNode node) { // recomputes sum of ORIGINAL subtree, redundant work
            if (node == null) return 0;
            return node.val + sumTree(node.left) + sumTree(node.right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `The returned value is ignored because the root has no parent(for root node).
      
      
    class Solution {
        public void toSumTree(TreeNode root) {
            computeSum(root);
        }
    
        // single post-order pass: transform node AND return original subtree sum simultaneously
        private int computeSum(TreeNode node) {
            if (node == null) return 0;
    
            int originalVal = node.val;
            int leftSum = computeSum(node.left);
            int rightSum = computeSum(node.right);
    
            node.val = leftSum + rightSum; // update node in place
    
            return originalVal + leftSum + rightSum; // return sum of original subtree to parent
        }
    }`
    },


    {
      title: `QUESTION:
    Given the root of a binary tree, flatten the tree into a "linked list" using the right child pointers (each node's left pointer set to null), following preorder traversal order.
    
    EXAMPLE:
    Input: root = [1,2,5,3,4,null,6]
    Output: [1,null,2,null,3,null,4,null,5,null,6]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — stores preorder traversal in a list first`,
    
      bruteForceCode: `class Solution {
        public void flatten(TreeNode root) {
            List<TreeNode> nodes = new ArrayList<>();
            preorder(root, nodes); // collect all nodes in preorder first
    
            for (int i = 0; i < nodes.size() - 1; i++) { // rebuild links using the list
                nodes.get(i).left = null;
                nodes.get(i).right = nodes.get(i + 1);
            }
            if (!nodes.isEmpty()) nodes.get(nodes.size() - 1).left = null;
        }
    
        private void preorder(TreeNode node, List<TreeNode> nodes) {
            if (node == null) return;
            nodes.add(node);
            preorder(node.left, nodes);
            preorder(node.right, nodes);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) extra — Morris-style in-place flattening`,
    
      optimalCode: `Here basically we r just pointing each curr's left node's rightmost node to point curr's right and curr.right to
       point to curr's left and curr.left to point to null
      
      
      class Solution {
        public void flatten(TreeNode root) {
            TreeNode curr = root;
    
            while (curr != null) {
                if (curr.left != null) {
                    // find rightmost node of left subtree (predecessor)
                    TreeNode pred = curr.left;
                    while (pred.right != null) pred = pred.right;
    
                    pred.right = curr.right; // attach original right subtree at the end
                    curr.right = curr.left;  // move left subtree to right
                    curr.left = null;
                }
                curr = curr.right; // move to next node
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the maximum path sum of any non-empty path (a path can start and end at any node, and must go through parent-child connections, but doesn't need to pass through the root).
    
    EXAMPLE:
    Input: root = [-10,9,20,null,null,15,7]
    Output: 42`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each node as potential path root, recomputes max downward sums separately
    Space Complexity: O(H) recursion stack`,
    
      bruteForceCode: `class Solution {
        int maxSum = Integer.MIN_VALUE;
    
        public int maxPathSum(TreeNode root) {
            traverseAllNodes(root);
            return maxSum;
        }
    
        private void traverseAllNodes(TreeNode node) {
            if (node == null) return;
    
            int pathThroughNode = node.val + maxDownward(node.left) + maxDownward(node.right); // recomputes downward sums from scratch
            maxSum = Math.max(maxSum, pathThroughNode);
    
            traverseAllNodes(node.left);
            traverseAllNodes(node.right);
        }
    
        private int maxDownward(TreeNode node) { // O(N) call, repeated for every node in outer traversal
            if (node == null) return 0;
            int left = Math.max(0, maxDownward(node.left));
            int right = Math.max(0, maxDownward(node.right));
            return node.val + Math.max(left, right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        int maxSum = Integer.MIN_VALUE;
    
        public int maxPathSum(TreeNode root) {
            maxDownward(root);
            return maxSum;
        }
    
        // single pass: compute max downward sum AND update global max path sum simultaneously
        private int maxDownward(TreeNode node) {
            if (node == null) return 0;
    
            int left = Math.max(0, maxDownward(node.left));  // ignore negative contributions
            int right = Math.max(0, maxDownward(node.right));
    
            maxSum = Math.max(maxSum, node.val + left + right); // path through this node as the "peak"
    
            return node.val + Math.max(left, right); // can only extend one branch upward
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the maximum width of the tree (the maximum number of nodes present between the leftmost and rightmost non-null nodes at any level, including the null nodes between them).
    
    EXAMPLE:
    Input: root = [1,3,2,5,3,null,9]
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each level, does a separate traversal to find leftmost/rightmost positions
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int widthOfBinaryTree(TreeNode root) {
            int height = getHeight(root);
            int maxWidth = 0;
    
            for (int level = 0; level < height; level++) { // separate pass per level
                List<Long> positions = new ArrayList<>();
                collectPositions(root, 0, level, 0, positions);
                if (!positions.isEmpty()) {
                    long width = positions.get(positions.size() - 1) - positions.get(0) + 1;
                    maxWidth = Math.max(maxWidth, (int) width);
                }
            }
            return maxWidth;
        }
    
        private int getHeight(TreeNode node) {
            if (node == null) return 0;
            return 1 + Math.max(getHeight(node.left), getHeight(node.right));
        }
    
        private void collectPositions(TreeNode node, int currLevel, int targetLevel, long pos, List<Long> positions) {
            if (node == null) return;
            if (currLevel == targetLevel) {
                positions.add(pos);
                return;
            }
            collectPositions(node.left, currLevel + 1, targetLevel, 2 * pos, positions);
            collectPositions(node.right, currLevel + 1, targetLevel, 2 * pos + 1, positions);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — queue holds at most one level's worth of nodes`,
    
      optimalCode: `Give every node the index it would have in a complete binary tree, then the width of each level is lastIndex - firstIndex + 1
      
      
      class Solution {
        public int widthOfBinaryTree(TreeNode root) {
            if (root == null) return 0;
            int maxWidth = 0;
    
            Queue<TreeNode> nodeQueue = new LinkedList<>();
            Queue<Long> indexQueue = new LinkedList<>();
            nodeQueue.offer(root);
            indexQueue.offer(0L);           //Why 0? Because root always gets index
    
            while (!nodeQueue.isEmpty()) {
                int size = nodeQueue.size();
                long first = indexQueue.peek(); // leftmost index at this level
                long last = first;
    
                for (int i = 0; i < size; i++) {
                    TreeNode node = nodeQueue.poll();
                    long idx = indexQueue.poll();
                    last = idx; // rightmost index seen so far this level
    
                    if (node.left != null) {
                        nodeQueue.offer(node.left);
                        indexQueue.offer(2 * idx);
                    }
                    if (node.right != null) {
                        nodeQueue.offer(node.right);
                        indexQueue.offer(2 * idx + 1);
                    }
                }
                maxWidth = Math.max(maxWidth, (int) (last - first + 1));
            }
            return maxWidth;
        }
    }`
    },
    
    
    {
      title: `QUESTION:
    Given the root of a binary tree, return the zigzag level order traversal of its nodes' values (alternating left-to-right, then right-to-left, level by level).
    
    EXAMPLE:
    Input: root = [3,9,20,null,null,15,7]
    Output: [[3],[20,9],[15,7]]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — does normal level order traversal, then reverses alternate levels using sorting-like overhead per level
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
            List<List<Integer>> result = new ArrayList<>();
            if (root == null) return result;
    
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            int level = 0;
    
            while (!queue.isEmpty()) {
                int size = queue.size();
                List<Integer> currentLevel = new ArrayList<>();
    
                for (int i = 0; i < size; i++) {
                    TreeNode node = queue.poll();
                    currentLevel.add(node.val); // always add left to right
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
    
                if (level % 2 == 1) {
                    Collections.reverse(currentLevel); // separate reversal pass for odd levels
                }
                result.add(currentLevel);
                level++;
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — queue holds at most one level's worth of nodes`,
    
      optimalCode: `Here basically we traversing using queue and adding in a new ArrayList(using addfirst and addlast)
     and keeping one lefttooright boolean variable which is set as true in starting and when it is true then we will
     add in ArrayList at last and when it is false then we will addfirst and we r changing its value after each level
     so that we can get the values in zig-zag manner that it
      
      
      class Solution {
        public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
            List<List<Integer>> result = new ArrayList<>();
            if (root == null) return result;
    
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            boolean leftToRight = true;
    
            while (!queue.isEmpty()) {
                int size = queue.size();
                LinkedList<Integer> currentLevel = new LinkedList<>(); // supports O(1) addFirst
    
                for (int i = 0; i < size; i++) {
                    TreeNode node = queue.poll();
    
                    if (leftToRight) {
                        currentLevel.addLast(node.val);
                    } else {
                        currentLevel.addFirst(node.val); // insert at front directly, no separate reversal pass
                    }
    
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
                result.add(currentLevel);
                leftToRight = !leftToRight;           // changing(if trur<-> false)
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, a target node, and an integer k, find the kth ancestor of the target node (the ancestor k levels above it in the tree). Return -1 or null if it doesn't exist.
    
    EXAMPLE:
    Input: root = [1,2,3,4,5,6,7], target = 5, k = 2
    Output: 1`,
    
      bruteForceComplexity: `Time Complexity: O(N) to find path + O(1) to index — but path storage adds overhead
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int kthAncestor(TreeNode root, TreeNode target, int k) {
            List<TreeNode> path = new ArrayList<>();
            findPath(root, target, path);
    
            int ancestorIndex = path.size() - 1 - k; // walk back k steps from target's position in path
            if (ancestorIndex < 0) return -1;
    
            return path.get(ancestorIndex).val;
        }
    
        private boolean findPath(TreeNode node, TreeNode target, List<TreeNode> path) {
            if (node == null) return false;
            path.add(node);
            if (node == target) return true;
    
            if (findPath(node.left, target, path) || findPath(node.right, target, path)) {
                return true;
            }
            path.remove(path.size() - 1); // backtrack
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack, no extra path storage`,
    
      optimalCode: `class Solution {
        private int result = -1;
    
        public int kthAncestor(TreeNode root, TreeNode target, int k) {
            findKthAncestor(root, target, k);
            return result;
        }
    
        // returns distance from 'target' if found in this subtree, else -1
        // sets 'result' as soon as distance reaches k while unwinding the recursion
        private int findKthAncestor(TreeNode node, TreeNode target, int k) {
            if (node == null) return -1;
            if (node == target) return 0;
    
            int leftDist = findKthAncestor(node.left, target, k);
            if (leftDist != -1) {
                if (leftDist + 1 == k) result = node.val;
                return leftDist + 1;
            }
    
            int rightDist = findKthAncestor(node.right, target, k);
            if (rightDist != -1) {
                if (rightDist + 1 == k) result = node.val;
                return rightDist + 1;
            }
    
            return -1;
        }
    }`
    },


    {
      title: `QUESTION:   (Binary Search Tree)
    Given the root of a Binary Search Tree, find the kth largest element in it.
    
    EXAMPLE:
    Input: root = [3,1,4,null,2], k = 1
    Output: 4`,
    
      bruteForceComplexity: `Time Complexity: O(N) but with extra overhead — collects all values then sorts
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int kthLargest(TreeNode root, int k) {
            List<Integer> values = new ArrayList<>();
            collect(root, values); // collect ALL nodes regardless of k
    
            Collections.sort(values); // ignores that inorder traversal is already sorted
            return values.get(values.size() - k);
        }
    
        private void collect(TreeNode node, List<Integer> values) {
            if (node == null) return;
            collect(node.left, values);
            values.add(node.val);
            collect(node.right, values);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(H + k) — reverse inorder traversal, stops early once kth element found
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        private int count = 0;
        private int result = -1;
    
        public int kthLargest(TreeNode root, int k) {
            reverseInorder(root, k);
            return result;
        }
    
        // reverse inorder (Right -> Root -> Left) visits nodes in descending order
        private void reverseInorder(TreeNode node, int k) {
            if (node == null || count >= k) return;
    
            reverseInorder(node.right, k);
            count++;
            if (count == k) {
                result = node.val;
                return; // stop as soon as kth largest is found
            }
            reverseInorder(node.left, k);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an integer array nums sorted in ascending order, convert it to a height-balanced binary search tree.
    
    EXAMPLE:
    Input: nums = [-10,-3,0,5,9]
    Output: [0,-3,9,-10,null,5]`,
    
      bruteForceComplexity: `Time Complexity: O(N) but produces an unbalanced/skewed tree — inserts elements one by one via standard BST insertion
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public TreeNode sortedArrayToBST(int[] nums) {
            TreeNode root = null;
            for (int num : nums) { // sequential insertion causes a skewed (linked-list-like) tree
                root = insert(root, num);
            }
            return root;
        }
    
        private TreeNode insert(TreeNode node, int val) {
            if (node == null) return new TreeNode(val);
            if (val < node.val) node.left = insert(node.left, val);
            else node.right = insert(node.right, val);
            return node;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(log N) recursion stack`,
    
      optimalCode: `class Solution {
        public TreeNode sortedArrayToBST(int[] nums) {
            return build(nums, 0, nums.length - 1);
        }
    
        // always pick the middle element as root -> guarantees balanced tree
        private TreeNode build(int[] nums, int left, int right) {
            if (left > right) return null;
    
            int mid = left + (right - left) / 2;
            TreeNode root = new TreeNode(nums[mid]);
    
            root.left = build(nums, left, mid - 1);
            root.right = build(nums, mid + 1, right);
    
            return root;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a Binary Search Tree, and an integer k, find the kth smallest element in it.
    
    EXAMPLE:
    Input: root = [5,3,6,2,4,null,null,1], k = 3
    Output: 3`,
    
      bruteForceComplexity: `Time Complexity: O(N) but with extra overhead — collects all values then sorts
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int kthSmallest(TreeNode root, int k) {
            List<Integer> values = new ArrayList<>();
            collect(root, values); // collect ALL nodes regardless of k
    
            Collections.sort(values); // ignores that inorder traversal is already sorted
            return values.get(k - 1);
        }
    
        private void collect(TreeNode node, List<Integer> values) {
            if (node == null) return;
            collect(node.left, values);
            values.add(node.val);
            collect(node.right, values);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(H + k) — inorder traversal, stops early once kth element found
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        private int count = 0;
        private int result = -1;
    
        public int kthSmallest(TreeNode root, int k) {
            inorder(root, k);
            return result;
        }
    
        // inorder traversal of a BST visits nodes in ascending order
        private void inorder(TreeNode node, int k) {
            if (node == null || count >= k) return;
    
            inorder(node.left, k);
            count++;
            if (count == k) {
                result = node.val;
                return; // stop as soon as kth smallest is found
            }
            inorder(node.right, k);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a Binary Search Tree and two nodes p and q, find their lowest common ancestor (LCA) in the BST.
    
    EXAMPLE:
    Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
    Output: 6`,
    
      bruteForceComplexity: `Time Complexity: O(N) — treats it like a generic binary tree, ignoring BST ordering property
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            List<TreeNode> pathP = new ArrayList<>();
            List<TreeNode> pathQ = new ArrayList<>();
    
            findPath(root, p, pathP); // full DFS search, ignoring BST property entirely
            findPath(root, q, pathQ);
    
            TreeNode lca = null;
            int i = 0;
            while (i < pathP.size() && i < pathQ.size() && pathP.get(i) == pathQ.get(i)) {
                lca = pathP.get(i);
                i++;
            }
            return lca;
        }
    
        private boolean findPath(TreeNode node, TreeNode target, List<TreeNode> path) {
            if (node == null) return false;
            path.add(node);
            if (node == target) return true;
            if (findPath(node.left, target, path) || findPath(node.right, target, path)) return true;
            path.remove(path.size() - 1);
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(H) — H = height of tree, uses BST ordering to skip unnecessary subtrees
    Space Complexity: O(1) — iterative, no recursion or extra storage`,
    
      optimalCode: `class Solution {
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            TreeNode curr = root;
    
            while (curr != null) {
                // both p and q are smaller -> LCA must be in left subtree
                if (p.val < curr.val && q.val < curr.val) {
                    curr = curr.left;
                }
                // both p and q are larger -> LCA must be in right subtree
                else if (p.val > curr.val && q.val > curr.val) {
                    curr = curr.right;
                }
                // split point found -> this is the LCA
                else {
                    return curr;
                }
            }
            return null;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST).
    
    EXAMPLE:
    Input: root = [5,1,4,null,null,3,6]
    Output: false`,
    
      bruteForceComplexity: `Time Complexity: O(N) but with extra overhead — collects inorder traversal into a list, then checks sorted order
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public boolean isValidBST(TreeNode root) {
            List<Integer> values = new ArrayList<>();
            inorder(root, values); // collect ALL values first
    
            for (int i = 1; i < values.size(); i++) { // separate pass to check strictly increasing order
                if (values.get(i) <= values.get(i - 1)) return false;
            }
            return true;
        }
    
        private void inorder(TreeNode node, List<Integer> values) {
            if (node == null) return;
            inorder(node.left, values);
            values.add(node.val);
            inorder(node.right, values);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack, no extra list storage`,
    
      optimalCode: `class Solution {
        public boolean isValidBST(TreeNode root) {
            return validate(root, null, null);
        }
    
        // pass down valid (min, max) bounds instead of collecting values first
        private boolean validate(TreeNode node, Long lower, Long upper) {
            if (node == null) return true;
    
            if (lower != null && node.val <= lower) return false;
            if (upper != null && node.val >= upper) return false;
    
            return validate(node.left, lower, (long) node.val) &&
                   validate(node.right, (long) node.val, upper);
        }
    }`
    },

    {
      title: `QUESTION:
    Given the root of a BST where exactly two nodes were swapped by mistake, recover the tree without changing its structure (fix it in place so it becomes a valid BST again).
    
    EXAMPLE:
    Input: root = [1,3,null,null,2]
    Output: [3,1,null,null,2]  (nodes 1 and 3 are swapped back)`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — collects all values, sorts them, then reassigns via another inorder pass
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public void recoverTree(TreeNode root) {
            List<TreeNode> nodes = new ArrayList<>();
            List<Integer> values = new ArrayList<>();
    
            collect(root, nodes, values); // gather all nodes and values
    
            Collections.sort(values); // brute-force fix: just sort all values (ignores the "only 2 swapped" insight)
    
            for (int i = 0; i < nodes.size(); i++) { // reassign sorted values back via another pass
                nodes.get(i).val = values.get(i);
            }
        }
    
        private void collect(TreeNode node, List<TreeNode> nodes, List<Integer> values) {
            if (node == null) return;
            collect(node.left, nodes, values);
            nodes.add(node);
            values.add(node.val);
            collect(node.right, nodes, values);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack, no extra list storage`,
    
      optimalCode: `Do an inorder traversal (which should be sorted in a BST), find the two places where the order decreases (prev.val > current.val),
     remember those two misplaced nodes, and swap their values at the end.
      
      
      class Solution {
        private TreeNode first, second, prev;
    
        public void recoverTree(TreeNode root) {
            inorder(root);
            int temp = first.val; // swap only the two problematic nodes directly
            first.val = second.val;
            second.val = temp;
        }
    
        // inorder traversal should be strictly increasing in a valid BST;
        // find the two nodes where this order is violated
        private void inorder(TreeNode node) {
            if (node == null) return;
            inorder(node.left);
    
            if (prev != null && prev.val > node.val) {
                if (first == null) first = prev;       // first violation
                second = node;                          // update on every violation (handles adjacent swap case)
            }
            prev = node;
    
            inorder(node.right);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a perfect binary tree where all leaves are on the same level, and every parent has two children, populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be null.
    
    EXAMPLE:
    Input: root = [1,2,3,4,5,6,7]
    Output: [1,#,2,3,#,4,5,6,7,#]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — uses a queue for level order traversal`,
    
      bruteForceCode: `class Solution {
        public Node connect(Node root) {
            if (root == null) return root;
            Queue<Node> queue = new LinkedList<>();
            queue.offer(root);
    
            while (!queue.isEmpty()) {
                int size = queue.size();
                Node prev = null;
    
                for (int i = 0; i < size; i++) { // standard BFS level order
                    Node node = queue.poll();
                    if (prev != null) prev.next = node;
                    prev = node;
    
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
            }
            return root;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) extra — uses already-established next pointers instead of a queue`,
    
      optimalCode: `Here basically we r connecting each node of same level that it and in while loop we r doing while(curr!=null)
       means after each level at last it will point that last node of each level to null but here we have represented with # 
      for clarity that it
      
      
      class Solution {
        public Node connect(Node root) {
            if (root == null) return root;
            Node leftmost = root;
    
            while (leftmost.left != null) { // while not at leaf level
                Node curr = leftmost;
    
                while (curr != null) {
                    curr.left.next = curr.right; // connect children within same parent
                    if (curr.next != null) {
                        curr.right.next = curr.next.left; // connect across different parents
                    }
                    curr = curr.next; // move to next node at current level using existing next pointers
                }
                leftmost = leftmost.left; // move down to next level
            }
            return root;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array of unique integers preorder, which represents the preorder traversal of a BST, construct the tree and return its root.
    
    EXAMPLE:
    Input: preorder = [8,5,1,7,10,12]
    Output: [8,5,10,1,7,null,12]`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for each node, linearly scans ahead to find where the right subtree begins
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        private int index = 0;
    
        public TreeNode bstFromPreorder(int[] preorder) {
            return build(preorder, Integer.MIN_VALUE, Integer.MAX_VALUE);
        }
    
        private TreeNode build(int[] preorder, int lower, int upper) {
            if (index == preorder.length || preorder[index] < lower || preorder[index] > upper) return null;
    
            int val = preorder[index++];
            TreeNode root = new TreeNode(val);
    
            // scans forward to find split point between left and right subtree values -- redundant since bounds already handle it
            int splitIndex = index;
            while (splitIndex < preorder.length && preorder[splitIndex] < val) splitIndex++;
    
            root.left = build(preorder, lower, val - 1);
            root.right = build(preorder, val + 1, upper);
    
            return root;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        private int index = 0;
    
        public TreeNode bstFromPreorder(int[] preorder) {
            return build(preorder, Integer.MIN_VALUE, Integer.MAX_VALUE);
        }
    
        // pass valid (lower, upper) bounds down -- BST property alone determines subtree membership
        private TreeNode build(int[] preorder, int lower, int upper) {
            if (index == preorder.length) return null;
    
            int val = preorder[index];
            if (val < lower || val > upper) return null; // doesn't belong in this subtree
    
            index++;
            TreeNode root = new TreeNode(val);
            root.left = build(preorder, lower, val - 1);
            root.right = build(preorder, val + 1, upper);
    
            return root;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Implement an iterator over a BST that supports next() (returns the next smallest number) and hasNext() operations. Both should run in average O(1) time and use O(H) memory.
    
    EXAMPLE:
    Input: root = [7,3,15,null,null,9,20], calls: next(), next(), hasNext(), next(), hasNext()
    Output: 3, 7, true, 9, true`,
    
      bruteForceComplexity: `Time Complexity: O(N) upfront, O(1) per next() call
    Space Complexity: O(N) — stores entire inorder traversal in a list`,
    
      bruteForceCode: `class BSTIterator {
        private List<Integer> values;
        private int index = 0;
    
        public BSTIterator(TreeNode root) {
            values = new ArrayList<>();
            inorder(root, values); // precompute and store ALL values upfront
        }
    
        private void inorder(TreeNode node, List<Integer> values) {
            if (node == null) return;
            inorder(node.left, values);
            values.add(node.val);
            inorder(node.right, values);
        }
    
        public int next() {
            return values.get(index++);
        }
    
        public boolean hasNext() {
            return index < values.size();
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(1) average per next() call, O(H) for hasNext()
    Space Complexity: O(H) — only stores nodes along the current path, not the whole tree`,
    
      optimalCode: `Maintain a stack of the leftmost path; next() pops the smallest node and then pushes the leftmost path of its right 
      subtree, giving inorder traversal lazily in O(h) space.
      
      
      class BSTIterator {
        private Deque<TreeNode> stack;
    
        public BSTIterator(TreeNode root) {
            stack = new ArrayDeque<>();
            pushLeft(root); // push only the leftmost path initially
        }
    
        public int next() {
            TreeNode node = stack.pop();
            if (node.right != null) {
                pushLeft(node.right); // push leftmost path of right subtree, lazily
            }
            return node.val;
        }
    
        public boolean hasNext() {
            return !stack.isEmpty();
        }
    
        private void pushLeft(TreeNode node) {
            while (node != null) {
                stack.push(node);
                node = node.left;
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a Binary Search Tree, flatten it into a sorted singly linked list (using right pointers only, left set to null), following ascending order.
    
    EXAMPLE:
    Input: root = [5,3,6,2,4,null,8]
    Output: [2,3,4,5,6,8]`,
    
      bruteForceComplexity: `Time Complexity: O(N)
    Space Complexity: O(N) — stores inorder traversal in a list first`,
    
      bruteForceCode: `class Solution {
        public TreeNode flatten(TreeNode root) {
            List<TreeNode> nodes = new ArrayList<>();
            inorder(root, nodes); // collect all nodes in sorted (inorder) order
    
            for (int i = 0; i < nodes.size() - 1; i++) { // rebuild links using the list
                nodes.get(i).left = null;
                nodes.get(i).right = nodes.get(i + 1);
            }
            if (!nodes.isEmpty()) nodes.get(nodes.size() - 1).left = null;
    
            return nodes.isEmpty() ? null : nodes.get(0);
        }
    
        private void inorder(TreeNode node, List<TreeNode> nodes) {
            if (node == null) return;
            inorder(node.left, nodes);
            nodes.add(node);
            inorder(node.right, nodes);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack, no extra list storage`,
    
      optimalCode: `Perform an inorder traversal, keep a prev pointer to the previously visited node, connect prev.right to
     the current node, set prev.left = null, and update prev, producing a sorted right-skewed linked list in one traversal.
      
      
      class Solution {
        private TreeNode prev = null;
        private TreeNode newHead = null;
    
        public TreeNode flatten(TreeNode root) {
            inorder(root);
            return newHead;
        }
    
        // single inorder pass: relink nodes on the fly as we visit them
        private void inorder(TreeNode node) {
            if (node == null) return;
    
            inorder(node.left);
    
            if (prev == null) {
                newHead = node; // first node visited becomes the head
            } else {
                prev.right = node; // link previous node to current
                prev.left = null;
            }
            prev = node;
    
            TreeNode rightChild = node.right; // save before overwriting
            inorder(rightChild);
        }
    }`
    },


    {
      title: `QUESTION:
    Given the roots of two Binary Search Trees, return all elements of both BSTs in a single sorted list.
    
    EXAMPLE:
    Input: root1 = [2,1,4], root2 = [1,0,3]
    Output: [0,1,1,2,3,4]`,
    
      bruteForceComplexity: `Time Complexity: O((N+M) log(N+M)) — collect all values from both trees, then sort
    Space Complexity: O(N+M)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> mergeTwoBSTs(TreeNode root1, TreeNode root2) {
            List<Integer> values = new ArrayList<>();
            collect(root1, values);
            collect(root2, values);
    
            Collections.sort(values); // ignores that each tree's inorder is already sorted individually
            return values;
        }
    
        private void collect(TreeNode node, List<Integer> values) {
            if (node == null) return;
            collect(node.left, values);
            values.add(node.val);
            collect(node.right, values);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N+M)
    Space Complexity: O(N+M) — two lists (already sorted) merged directly`,
    
      optimalCode: `class Solution {
        public List<Integer> mergeTwoBSTs(TreeNode root1, TreeNode root2) {
            List<Integer> list1 = new ArrayList<>();
            List<Integer> list2 = new ArrayList<>();
            inorder(root1, list1); // each inorder traversal is already sorted
            inorder(root2, list2);
    
            return mergeSortedLists(list1, list2); // linear merge, no sorting needed
        }
    
        private void inorder(TreeNode node, List<Integer> values) {
            if (node == null) return;
            inorder(node.left, values);
            values.add(node.val);
            inorder(node.right, values);
        }
    
        private List<Integer> mergeSortedLists(List<Integer> list1, List<Integer> list2) {
            List<Integer> result = new ArrayList<>();
            int i = 0, j = 0;
    
            while (i < list1.size() && j < list2.size()) {
                if (list1.get(i) <= list2.get(j)) result.add(list1.get(i++));
                else result.add(list2.get(j++));
            }
            while (i < list1.size()) result.add(list1.get(i++));
            while (j < list2.size()) result.add(list2.get(j++));
    
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Design an algorithm to serialize and deserialize a Binary Search Tree. Serialization converts the tree to a string; deserialization reconstructs it from that string.
    
    EXAMPLE:
    Input: root = [4,2,5,1,3]
    Output: (serialized string) -> deserialize -> same tree structure`,
    
      bruteForceComplexity: `Time Complexity: O(N) but treats it like a generic tree — serializes with null markers, ignoring BST property
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Codec {
        public String serialize(TreeNode root) {
            StringBuilder sb = new StringBuilder();
            preorder(root, sb); // includes null markers, like a generic binary tree
            return sb.toString();
        }
    
        private void preorder(TreeNode node, StringBuilder sb) {
            if (node == null) {
                sb.append("#,");
                return;
            }
            sb.append(node.val).append(",");
            preorder(node.left, sb);
            preorder(node.right, sb);
        }
    
        public TreeNode deserialize(String data) {
            Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(",")));
            return buildTree(nodes);
        }
    
        private TreeNode buildTree(Queue<String> nodes) {
            String val = nodes.poll();
            if (val.equals("#")) return null;
    
            TreeNode node = new TreeNode(Integer.parseInt(val));
            node.left = buildTree(nodes);
            node.right = buildTree(nodes);
            return node;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N) for both serialize and deserialize
    Space Complexity: O(N) — no null markers needed, more compact string`,
    
      optimalCode: `class Codec {
        public String serialize(TreeNode root) {
            StringBuilder sb = new StringBuilder();
            preorder(root, sb); // no null markers needed -- BST property lets us reconstruct structure
            return sb.toString().trim();
        }
    
        private void preorder(TreeNode node, StringBuilder sb) {
            if (node == null) return;
            sb.append(node.val).append(" ");
            preorder(node.left, sb);
            preorder(node.right, sb);
        }
    
        private int index = 0;
    
        public TreeNode deserialize(String data) {
            if (data.isEmpty()) return null;
            String[] values = data.split(" ");
            index = 0;
            return build(values, Integer.MIN_VALUE, Integer.MAX_VALUE);
        }
    
        // exploits BST property: use bounds to determine subtree membership, same as "Construct from Preorder"
        private TreeNode build(String[] values, int lower, int upper) {
            if (index == values.length) return null;
    
            int val = Integer.parseInt(values[index]);
            if (val < lower || val > upper) return null;
    
            index++;
            TreeNode node = new TreeNode(val);
            node.left = build(values, lower, val - 1);
            node.right = build(values, val + 1, upper);
            return node;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a Binary Search Tree and a target node, find the inorder predecessor of the target node (the node with the largest value smaller than the target's value).
    
    EXAMPLE:
    Input: root = [20,10,30,5,15], target = 15
    Output: 10`,
    
      bruteForceComplexity: `Time Complexity: O(N) — collects entire inorder traversal, then searches for the predecessor
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public TreeNode inorderPredecessor(TreeNode root, TreeNode target) {
            List<TreeNode> nodes = new ArrayList<>();
            inorder(root, nodes); // collect ALL nodes in sorted order
    
            for (int i = 0; i < nodes.size(); i++) { // linear scan to find target, then look one back
                if (nodes.get(i) == target) {
                    return (i > 0) ? nodes.get(i - 1) : null;
                }
            }
            return null;
        }
    
        private void inorder(TreeNode node, List<TreeNode> nodes) {
            if (node == null) return;
            inorder(node.left, nodes);
            nodes.add(node);
            inorder(node.right, nodes);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(H) — H = height of tree
    Space Complexity: O(1) — iterative, no recursion or extra storage`,
    
      optimalCode: `class Solution {
        public TreeNode inorderPredecessor(TreeNode root, TreeNode target) {
            TreeNode predecessor = null;
            TreeNode curr = root;
    
            while (curr != null) {
                if (target.val > curr.val) {
                    predecessor = curr; // curr could be the predecessor, keep going right for a closer one
                    curr = curr.right;
                } else {
                    curr = curr.left; // predecessor must be somewhere in left subtree, or doesn't exist here
                }
            }
            return predecessor;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a binary tree, find the size of the largest subtree which is also a Binary Search Tree.
    
    EXAMPLE:
    Input: root = [10,5,15,1,8,null,7]
    Output: 3  (the subtree rooted at 5, containing nodes 1, 5, 8)`,
    
      bruteForceComplexity: `Time Complexity: O(N^2) — for every node, checks if its subtree is a valid BST via a separate full traversal
    Space Complexity: O(H) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int largestBSTSubtree(TreeNode root) {
            int maxSize = 0;
            maxSize = Math.max(maxSize, checkAndSize(root)); // check root
            return exploreAllNodes(root, maxSize);
        }
    
        private int exploreAllNodes(TreeNode node, int maxSize) {
            if (node == null) return maxSize;
            if (isValidBST(node, null, null)) { // separate full validation for every node
                maxSize = Math.max(maxSize, size(node));
            }
            maxSize = exploreAllNodes(node.left, maxSize);
            maxSize = exploreAllNodes(node.right, maxSize);
            return maxSize;
        }
    
        private int checkAndSize(TreeNode node) {
            return isValidBST(node, null, null) ? size(node) : 0;
        }
    
        private boolean isValidBST(TreeNode node, Integer lower, Integer upper) {
            if (node == null) return true;
            if (lower != null && node.val <= lower) return false;
            if (upper != null && node.val >= upper) return false;
            return isValidBST(node.left, lower, node.val) && isValidBST(node.right, node.val, upper);
        }
    
        private int size(TreeNode node) {
            if (node == null) return 0;
            return 1 + size(node.left) + size(node.right);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(H) recursion stack`,
    
      optimalCode: `class Solution {
        class Info {
            boolean isBST;
            int size;
            int min, max;
            Info(boolean isBST, int size, int min, int max) {
                this.isBST = isBST; this.size = size; this.min = min; this.max = max;
            }
        }
    
        int maxSize = 0;
    
        public int largestBSTSubtree(TreeNode root) {
            postorder(root);
            return maxSize;
        }
    
        // single post-order pass: each node returns whether its subtree is a BST, its size, and its value range
        private Info postorder(TreeNode node) {
            if (node == null) return new Info(true, 0, Integer.MAX_VALUE, Integer.MIN_VALUE);
    
            Info left = postorder(node.left);
            Info right = postorder(node.right);
    
            if (left.isBST && right.isBST && node.val > left.max && node.val < right.min) {
                int size = left.size + right.size + 1;
                maxSize = Math.max(maxSize, size);
                return new Info(true, size, Math.min(node.val, left.min), Math.max(node.val, right.max));
            }
    
            return new Info(false, 0, 0, 0); // not a valid BST, size doesn't matter
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the root of a Binary Search Tree and a target node, find the inorder successor of the target node (the node with the smallest value greater than the target's value).
    
    EXAMPLE:
    Input: root = [20,10,30,5,15], target = 15
    Output: 20`,
    
      bruteForceComplexity: `Time Complexity: O(N) — collects entire inorder traversal, then searches for the successor
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public TreeNode inorderSuccessor(TreeNode root, TreeNode target) {
            List<TreeNode> nodes = new ArrayList<>();
            inorder(root, nodes); // collect ALL nodes in sorted order
    
            for (int i = 0; i < nodes.size(); i++) { // linear scan to find target, then look one ahead
                if (nodes.get(i) == target) {
                    return (i < nodes.size() - 1) ? nodes.get(i + 1) : null;
                }
            }
            return null;
        }
    
        private void inorder(TreeNode node, List<TreeNode> nodes) {
            if (node == null) return;
            inorder(node.left, nodes);
            nodes.add(node);
            inorder(node.right, nodes);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(H) — H = height of tree
    Space Complexity: O(1) — iterative, no recursion or extra storage`,
    
      optimalCode: `class Solution {
        public TreeNode inorderSuccessor(TreeNode root, TreeNode target) {
            TreeNode successor = null;
            TreeNode curr = root;
    
            while (curr != null) {
                if (target.val < curr.val) {
                    successor = curr; // curr could be the successor, keep going left for a closer one
                    curr = curr.left;
                } else {
                    curr = curr.right; // successor must be somewhere in right subtree, or doesn't exist here
                }
            }
            return successor;
        }
    }`
    },

  ],

  "heaps":[

    {
      title: `TOPIC:
    Min-Heap vs Max-Heap using Java's PriorityQueue (PQ)
    
    EXAMPLE:
    Input added to heap: 5, 1, 3, 9, 2
    Min-Heap removal order: 1 -> 2 -> 3 -> 5 -> 9
    Max-Heap removal order: 9 -> 5 -> 3 -> 2 -> 1`,
    
      bruteForceComplexity: `MIN-HEAP EXPLANATION:
    A Min-Heap keeps the smallest element at the root. Every parent node is <= its children. peek() gives O(1) access to the minimum, and poll()/add() take O(log N) since the tree re-balances (sift up/down) after every change.
    
    Use case: Dijkstra's algorithm, merging K sorted lists, or finding K largest elements (by keeping a min-heap of size K and evicting the smallest when it overflows).`,
    
      bruteForceCode: `// Min-Heap PQ declaration (Java's default PQ behavior)
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    
    minHeap.add(5);
    minHeap.add(1);
    minHeap.add(3);
    minHeap.add(9);
    minHeap.add(2);
    
    System.out.println(minHeap.peek()); // 1 -> smallest is always at the top
    
    while (!minHeap.isEmpty()) {
        System.out.print(minHeap.poll() + " ");
    }
    // Output: 1 2 3 5 9
    
    // -------------------------------------------
    // Real usage: find K LARGEST elements using a MIN-heap of size K
    int[] arr = {7, 10, 4, 3, 20, 15};
    int k = 3;
    PriorityQueue<Integer> minHeapK = new PriorityQueue<>();
    
    for (int num : arr) {
        minHeapK.add(num);
        if (minHeapK.size() > k) {
            minHeapK.poll(); // evict the current smallest when heap overflows
        }
    }
    // minHeapK now holds: [10, 15, 20] -> the 3 largest elements`,
    
      optimalComplexity: `MAX-HEAP EXPLANATION:
    A Max-Heap keeps the largest element at the root. Every parent node is >= its children. peek() gives O(1) access to the maximum, and poll()/add() take O(log N), same as min-heap but with the comparator flipped.
    
    Use case: Job scheduling by highest priority, Huffman encoding, or finding K smallest elements (by keeping a max-heap of size K and evicting the largest when it overflows).`,
    
      optimalCode: `// Max-Heap PQ declaration (reverse the natural ordering)
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    // or: new PriorityQueue<>((a, b) -> b - a);
    
    maxHeap.add(5);
    maxHeap.add(1);
    maxHeap.add(3);
    maxHeap.add(9);
    maxHeap.add(2);
    
    System.out.println(maxHeap.peek()); // 9 -> largest is always at the top
    
    while (!maxHeap.isEmpty()) {
        System.out.print(maxHeap.poll() + " ");
    }
    // Output: 9 5 3 2 1
    
    // -------------------------------------------
    // Real usage: find K SMALLEST elements using a MAX-heap of size K
    int[] arr = {7, 10, 4, 3, 20, 15};
    int k = 3;
    PriorityQueue<Integer> maxHeapK = new PriorityQueue<>(Collections.reverseOrder());
    
    for (int num : arr) {
        maxHeapK.add(num);
        if (maxHeapK.size() > k) {
            maxHeapK.poll(); // evict the current largest when heap overflows
        }
    }
    // maxHeapK now holds: [3, 4, 7] -> the 3 smallest elements`
    },

    {
      title: `QUESTION:
    Insert an element into a binary heap (min-heap), maintaining the heap property.
    
    EXAMPLE:
    Input: heap = [1,3,5,7,9], insert 2
    Output: [1,3,2,7,9,5]  (heap array after insertion, satisfies min-heap property)`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — appends element then re-sorts and re-validates entire heap structure
    Space Complexity: O(N)`,
    
      bruteForceCode: `class MinHeap {
        List<Integer> heap = new ArrayList<>();
    
        public void insert(int val) {
            heap.add(val);
            Collections.sort(heap); // sorts the ENTIRE array instead of just fixing local heap property
            // note: a sorted array technically satisfies heap property but this is massive overkill
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log N)
    Space Complexity: O(1) extra`,
    
      optimalCode: `class MinHeap {
        List<Integer> heap = new ArrayList<>();
    
        public void insert(int val) {
            heap.add(val); // place at the end
            int i = heap.size() - 1;
    
            // bubble up: swap with parent while heap property is violated
            while (i > 0) {
                int parent = (i - 1) / 2;
                if (heap.get(parent) <= heap.get(i)) break; // heap property satisfied
                Collections.swap(heap, i, parent);
                i = parent;
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Delete the root (minimum) element from a binary heap (min-heap), maintaining the heap property.
    
    EXAMPLE:
    Input: heap = [1,2,3,7,9,5]
    Output: [2,5,3,7,9]  (heap array after removing the min)`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — removes root then re-sorts entire array from scratch
    Space Complexity: O(N)`,
    
      bruteForceCode: `class MinHeap {
        List<Integer> heap = new ArrayList<>();
    
        public int deleteMin() {
            int min = heap.get(0);
            heap.remove(0); // O(N) shift
            Collections.sort(heap); // resorts everything instead of just fixing local violation
            return min;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log N)
    Space Complexity: O(1) extra`,
    
      optimalCode: `class MinHeap {
        List<Integer> heap = new ArrayList<>();
    
        public int deleteMin() {
            int min = heap.get(0);
            int last = heap.remove(heap.size() - 1); // remove last element
    
            if (!heap.isEmpty()) {
                heap.set(0, last); // move last element to root
                heapifyDown(0);
            }
            return min;
        }
    
        private void heapifyDown(int i) {
            int n = heap.size();
            while (true) {
                int left = 2 * i + 1, right = 2 * i + 2, smallest = i;
    
                if (left < n && heap.get(left) < heap.get(smallest)) smallest = left;
                if (right < n && heap.get(right) < heap.get(smallest)) smallest = right;
    
                if (smallest == i) break; // heap property restored
                Collections.swap(heap, i, smallest);
                i = smallest;
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array of integers, sort the array in ascending order using Heap Sort.
    
    EXAMPLE:
    Input: nums = [12,11,13,5,6,7]
    Output: [5,6,7,11,12,13]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) but with extra overhead — uses a library PriorityQueue instead of in-place heapify
    Space Complexity: O(N) — auxiliary heap structure`,
    
      bruteForceCode: `class Solution {
        public int[] heapSort(int[] nums) {
            PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // library heap, not in-place array heapify
            for (int num : nums) minHeap.offer(num);
    
            int[] result = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                result[i] = minHeap.poll();
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(1) — true in-place sorting`,
    
      optimalCode: `class Solution {
        public int[] heapSort(int[] nums) {
            int n = nums.length;
              //Only parent nodes need to be heapified
            for (int i = n / 2 - 1; i >= 0; i--) { // build max heap in-place
                heapify(nums, n, i);
            }
    
            for (int i = n - 1; i > 0; i--) { // extract max repeatedly, place at end
                int temp = nums[0];           //here we r swapping num[0] and last and then heapify for maxheap as in maxheap largest element stays at root and we r swapping at end and reducing i--
                nums[0] = nums[i];
                nums[i] = temp;
                heapify(nums, i, 0);
            }
            return nums;
        }
    
        private void heapify(int[] nums, int heapSize, int rootIdx) {
            int largest = rootIdx, left = 2 * rootIdx + 1, right = 2 * rootIdx + 2;
    
            if (left < heapSize && nums[left] > nums[largest]) largest = left;
            if (right < heapSize && nums[right] > nums[largest]) largest = right;
    
            if (largest != rootIdx) {
                int temp = nums[rootIdx];
                nums[rootIdx] = nums[largest];
                nums[largest] = temp;
                heapify(nums, heapSize, largest);
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given the locations of N cars and a reference point, find the K nearest cars to that reference point based on Euclidean distance.
    
    EXAMPLE:
    Input: points = [[1,3],[-2,2],[5,8],[0,1]], reference = [0,0], K = 2
    Output: [[-2,2],[0,1]]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — computes all distances, then sorts the entire array
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int[][] nearestCars(int[][] points, int[] reference, int K) {
            Arrays.sort(points, (a, b) -> {
                int distA = dist(a, reference);
                int distB = dist(b, reference);
                return distA - distB; // full sort of ALL points by distance
            });
            return Arrays.copyOfRange(points, 0, K);
        }
    
        private int dist(int[] p, int[] ref) {
            return (p[0] - ref[0]) * (p[0] - ref[0]) + (p[1] - ref[1]) * (p[1] - ref[1]);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log K)
    Space Complexity: O(K) for the heap`,
    
      optimalCode: `class Solution {
        public int[][] nearestCars(int[][] points, int[] reference, int K) {
            // max-heap of size K, keeps K nearest points seen so far, farthest on top
            PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> dist(b, reference) - dist(a, reference));
    
            for (int[] p : points) {
                maxHeap.offer(p);
                if (maxHeap.size() > K) maxHeap.poll(); // evict farthest
            }
    
            int[][] result = new int[K][2];
            for (int i = K - 1; i >= 0; i--) result[i] = maxHeap.poll();
            return result;
        }
    
        private int dist(int[] p, int[] ref) {
            return (p[0] - ref[0]) * (p[0] - ref[0]) + (p[1] - ref[1]) * (p[1] - ref[1]);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given N ropes of different lengths, connect ropes into one rope with minimum total cost, where the cost to connect two ropes equals the sum of their lengths.
    
    EXAMPLE:
    Input: ropes = [4,3,2,6]
    Output: 29`,
    
      bruteForceComplexity: `Time Complexity: O(N^2 log N) — sorts the array from scratch after every single merge
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int minCost(int[] ropes) {
            List<Integer> lengths = new ArrayList<>();
            for (int r : ropes) lengths.add(r);
    
            int totalCost = 0;
            while (lengths.size() > 1) {
                Collections.sort(lengths); // re-sorts EVERYTHING every iteration just to find 2 smallest
                int first = lengths.remove(0);
                int second = lengths.remove(0);
                int cost = first + second;
                totalCost += cost;
                lengths.add(cost);
            }
            return totalCost;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N)
    Space Complexity: O(N) for the heap`,
    
      optimalCode: `class Solution {
        public int minCost(int[] ropes) {
            PriorityQueue<Integer> minHeap = new PriorityQueue<>();
            for (int r : ropes) minHeap.offer(r);
    
            int totalCost = 0;
            while (minHeap.size() > 1) { // always combine the two smallest ropes
                int first = minHeap.poll();
                int second = minHeap.poll();
                int cost = first + second;
                totalCost += cost;
                minHeap.offer(cost);
            }
            return totalCost;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a 2D binary matrix representing soldiers (1) and civilians (0) in each row (soldiers ordered to the left), where rows are sorted by soldier strength, return the indices of the K weakest rows in order.
    
    EXAMPLE:
    Input: mat = [[1,1,0,0],[1,1,1,1],[1,0,0,0],[1,1,0,0],[1,1,1,1]], K = 3
    Output: [2,0,3]`,
    
      bruteForceComplexity: `Time Complexity: O(N*M log N) — counts soldiers per row, then sorts ALL rows by count
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int[] kWeakestRows(int[][] mat, int K) {
            int n = mat.length;
            Integer[] indices = new Integer[n];
            int[] soldierCount = new int[n];
    
            for (int i = 0; i < n; i++) {
                indices[i] = i;
                for (int val : mat[i]) soldierCount[i] += val; // count soldiers in row
            }
    
            Arrays.sort(indices, (a, b) -> soldierCount[a] != soldierCount[b]
                ? soldierCount[a] - soldierCount[b] : a - b); // sorts ALL rows
    
            int[] result = new int[K];
            for (int i = 0; i < K; i++) result[i] = indices[i];
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log M + N log K) — binary search for soldier count per row + heap of size K
    Space Complexity: O(K) for the heap`,
    
      optimalCode: `class Solution {
        public int[] kWeakestRows(int[][] mat, int K) {
            int n = mat.length;
            // max-heap of size K on [soldierCount, rowIndex], weakest kept, strongest evicted
            PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) ->
                a[0] != b[0] ? b[0] - a[0] : b[1] - a[1]);   // sorting 1st checking max no of soldiers and if same then index based sorting (both desc)
    
            for (int i = 0; i < n; i++) {
                int count = countSoldiers(mat[i]); // binary search since row is sorted (1s then 0s)
                maxHeap.offer(new int[]{count, i});
                if (maxHeap.size() > K) maxHeap.poll();
            }
    
            int[] result = new int[K];
            for (int i = K - 1; i >= 0; i--) result[i] = maxHeap.poll()[1];
            return result;
        }
    
        private int countSoldiers(int[] row) { // binary search for first 0 (row is sorted: 1s then 0s)
            int lo = 0, hi = row.length;
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (row[mid] == 1) lo = mid + 1;
                else hi = mid;
            }
            return lo;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an array nums and a window size k, return an array of the maximum element in every contiguous window of size k as it slides from left to right.
    
    EXAMPLE:
    Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
    Output: [3,3,5,5,6,7]`,
    
      bruteForceComplexity: `Time Complexity: O(N*K) — scans the entire window from scratch for every position
    Space Complexity: O(N-K+1) for the result`,
    
      bruteForceCode: `class Solution {
        public int[] maxSlidingWindow(int[] nums, int k) {
            int n = nums.length;
            int[] result = new int[n - k + 1];
    
            for (int i = 0; i <= n - k; i++) {
                int max = Integer.MIN_VALUE;
                for (int j = i; j < i + k; j++) { // rescans entire window every time
                    max = Math.max(max, nums[j]);
                }
                result[i] = max;
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(K) for the deque`,
    
      optimalCode: `👉 Use a monotonic decreasing deque of indices: remove expired indices from the front, remove smaller elements from
      the back because a new larger element makes them useless, then the front always represents the maximum of the current sliding window.
      
      
      class Solution {
        public int[] maxSlidingWindow(int[] nums, int k) {
            int n = nums.length;
            int[] result = new int[n - k + 1];
            Deque<Integer> deque = new ArrayDeque<>(); // stores indices, monotonic decreasing values
    
            for (int i = 0; i < n; i++) {
                if (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                    deque.pollFirst(); // remove indices out of current window
                }
                while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                    deque.pollLast(); // remove smaller elements, they can never be the max again
                }
                deque.offerLast(i);
    
                if (i >= k - 1) {
                    result[i - k + 1] = nums[deque.peekFirst()]; // front of deque = max of current window
                }
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given two strings s and t, return true if t is an anagram of s (contains the same characters with the same frequencies, in any order).
    
    EXAMPLE:
    Input: s = "anagram", t = "nagaram"
    Output: true`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — sorts both strings and compares
    Space Complexity: O(N) for character arrays`,
    
      bruteForceCode: `class Solution {
        public boolean isAnagram(String s, String t) {
            if (s.length() != t.length()) return false;
    
            char[] sArr = s.toCharArray();
            char[] tArr = t.toCharArray();
            Arrays.sort(sArr); // sorts both strings just to compare, more work than needed
            Arrays.sort(tArr);
    
            return Arrays.equals(sArr, tArr);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N)
    Space Complexity: O(1) — fixed-size 26-character frequency array`,
    
      optimalCode: `class Solution {
        public boolean isAnagram(String s, String t) {
            if (s.length() != t.length()) return false;
    
            int[] freq = new int[26];
            for (int i = 0; i < s.length(); i++) {
                freq[s.charAt(i) - 'a']++; // increment for s
                freq[t.charAt(i) - 'a']--; // decrement for t
            }
    
            for (int count : freq) { // if s and t are anagrams, all counts should cancel to 0
                if (count != 0) return false;
            }
            return true;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given two integer arrays nums1 and nums2, return their union (unique elements from both) and their intersection (common elements).
    
    EXAMPLE:
    Input: nums1 = [1,2,2,1], nums2 = [2,2]
    Output: union = [1,2], intersection = [2]`,
    
      bruteForceComplexity: `Time Complexity: O(N*M) — nested loops checking every pair for equality
    Space Complexity: O(N+M) for result storage`,
    
      bruteForceCode: `class Solution {
        public List<Integer> union(int[] nums1, int[] nums2) {
            List<Integer> result = new ArrayList<>();
            for (int num : nums1) {
                if (!result.contains(num)) result.add(num); // O(N) contains check each time
            }
            for (int num : nums2) {
                if (!result.contains(num)) result.add(num);
            }
            return result;
        }
    
        public List<Integer> intersection(int[] nums1, int[] nums2) {
            List<Integer> result = new ArrayList<>();
            for (int a : nums1) {
                for (int b : nums2) { // nested loop, O(N*M)
                    if (a == b && !result.contains(a)) {
                        result.add(a);
                    }
                }
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N+M)
    Space Complexity: O(N+M) for the hash sets`,
    
      optimalCode: `class Solution {
        public List<Integer> union(int[] nums1, int[] nums2) {
            Set<Integer> set = new LinkedHashSet<>(); // preserves insertion order, dedupes automatically
            for (int num : nums1) set.add(num);
            for (int num : nums2) set.add(num);
            return new ArrayList<>(set);
        }
    
        public List<Integer> intersection(int[] nums1, int[] nums2) {
            Set<Integer> set1 = new HashSet<>();
            for (int num : nums1) set1.add(num);
    
            Set<Integer> result = new LinkedHashSet<>();
            for (int num : nums2) {
                if (set1.contains(num)) result.add(num); // O(1) lookup instead of nested loop
            }
            return new ArrayList<>(result);
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a list of airline tickets represented as pairs of departure and arrival airports [from, to], reconstruct the itinerary in order, starting from "JFK". If multiple valid itineraries exist, return the lexicographically smallest one. Assume all tickets form at least one valid itinerary using all tickets exactly once.
    
    EXAMPLE:
    Input: tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
    Output: ["JFK","MUC","LHR","SFO","SJC"]`,
    
      bruteForceComplexity: `Time Complexity: O(N!) — tries every permutation of tickets to find a valid itinerary
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public List<String> findItinerary(List<List<String>> tickets) {
            List<List<String>> remaining = new ArrayList<>(tickets);
            List<String> itinerary = new ArrayList<>();
            itinerary.add("JFK");
    
            tryBuild(remaining, itinerary, "JFK", tickets.size());
            return itinerary;
        }
    
        // tries every unused ticket at every step -- exponential without any ordering heuristic
        private boolean tryBuild(List<List<String>> remaining, List<String> itinerary, String curr, int totalTickets) {
            if (itinerary.size() == totalTickets + 1) return true;
    
            for (int i = 0; i < remaining.size(); i++) {
                List<String> ticket = remaining.get(i);
                if (ticket.get(0).equals(curr)) {
                    remaining.remove(i);
                    itinerary.add(ticket.get(1));
    
                    if (tryBuild(remaining, itinerary, ticket.get(1), totalTickets)) return true;
    
                    itinerary.remove(itinerary.size() - 1); // backtrack
                    remaining.add(i, ticket);
                }
            }
            return false;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — sorting tickets + Hierholzer's algorithm for Eulerian path
    Space Complexity: O(N) for the adjacency map`,
    
      optimalCode: `
      
        class Solution {
            public List<String> findItinerary(List<List<String>> tickets) {
                // adjacency map: airport -> sorted min-heap of destinations (lexicographically smallest first)
                Map<String, PriorityQueue<String>> graph = new HashMap<>();
                for (List<String> ticket : tickets) {
                    String from = ticket.get(0);
                    String to = ticket.get(1);

                    PriorityQueue<String> destinations = graph.getOrDefault(from, new PriorityQueue<>());
                    // if 'from' already in map, get its heap; else default to a brand-new empty heap
                    destinations.offer(to);            // add this destination into that heap
                    graph.put(from, destinations);      // put it back into the map (needed since getOrDefault doesn't insert)
                }

                LinkedList<String> itinerary = new LinkedList<>();
                // Hierholzer's algorithm: DFS, backtrack by prepending to result (post-order)
                dfs("JFK", graph, itinerary);
                return itinerary;
            }

            private void dfs(String airport, Map<String, PriorityQueue<String>> graph, LinkedList<String> itinerary) {
                PriorityQueue<String> destinations = graph.get(airport);
                while (destinations != null && !destinations.isEmpty()) {
                    String next = destinations.poll();   // always take lexicographically smallest unused destination
                    dfs(next, graph, itinerary);
                }
                itinerary.addFirst(airport);   // add in post-order, builds correct Eulerian path
            }
        }`
    },


    {
      title: `QUESTION:
    Given K sorted arrays, merge them into a single sorted array.
    
    EXAMPLE:
    Input: arrays = [[1,4,5],[1,3,4],[2,6]]
    Output: [1,1,2,3,4,4,5,6]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — N = total elements, collects everything then sorts
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public List<Integer> mergeKSortedArrays(int[][] arrays) {
            List<Integer> result = new ArrayList<>();
    
            for (int[] arr : arrays) { // dump everything into one list, ignoring individual sorted order
                for (int val : arr) {
                    result.add(val);
                }
            }
    
            Collections.sort(result); // sorts from scratch instead of using the merge property
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log K) — N = total elements, K = number of arrays
    Space Complexity: O(K) for the heap + O(N) for result`,
    
      optimalCode: `Always pull the globally smallest element via a min-heap (one candidate from each array at a time), append it to the result, and push that array's 
      next element in — since each individual array is already sorted, the heap always has access to the true next-smallest value across all arrays.
      
      
      class Solution {
        public List<Integer> mergeKSortedArrays(int[][] arrays) {
            List<Integer> result = new ArrayList<>();
            // min-heap of [value, arrayIndex, elementIndex]
            PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    
            for (int i = 0; i < arrays.length; i++) { // seed heap with first element of each array
                if (arrays[i].length > 0) {
                    minHeap.offer(new int[]{arrays[i][0], i, 0});
                }
            }
    
            while (!minHeap.isEmpty()) {
                int[] curr = minHeap.poll();
                result.add(curr[0]);
    
                int arrIdx = curr[1], elemIdx = curr[2];
                if (elemIdx + 1 < arrays[arrIdx].length) { // push next element from same array
                    minHeap.offer(new int[]{arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1});
                }
            }
            return result;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an integer array nums and an integer k, return the k most frequent elements.
    
    EXAMPLE:
    Input: nums = [1,1,1,2,2,3], k = 2
    Output: [1,2]`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — counts frequencies, then sorts all unique elements by frequency
    Space Complexity: O(N)`,
    
      bruteForceCode: `class Solution {
        public int[] topKFrequent(int[] nums, int k) {
            Map<Integer, Integer> freqMap = new HashMap<>();
            for (int num : nums) freqMap.merge(num, 1, Integer::sum);
    
            List<Integer> unique = new ArrayList<>(freqMap.keySet());
            unique.sort((a, b) -> freqMap.get(b) - freqMap.get(a)); // full sort of ALL unique elements
    
            int[] result = new int[k];
            for (int i = 0; i < k; i++) result[i] = unique.get(i);
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log K)
    Space Complexity: O(N) for frequency map + O(K) for heap`,
    
      optimalCode: `Keep a min-heap capped at size k, so that as you push every (number, frequency) pair, the single least frequent one gets evicted each time the heap overflows past k — guaranteeing
       only the k most frequent elements survive by the end.
      
        class Solution {
            public int[] topKFrequent(int[] nums, int k) {
                Map<Integer, Integer> freqMap = new HashMap<>();
                for (int num : nums) {
                    freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);   // if num seen before, get its count, else default 0, then +1
                }

                // min-heap of size k, keeps only the k most frequent elements seen so far
                PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
                    new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

                for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
                    minHeap.offer(entry);
                    if (minHeap.size() > k) minHeap.poll();   // evict least frequent
                }

                int[] result = new int[k];
                for (int i = k - 1; i >= 0; i--) {
                    result[i] = minHeap.poll().getKey();
                }
                return result;
            }
        }`
    },
    
    {
      title: `QUESTION:
    Design a data structure that supports adding numbers from a stream, and finding the median of all numbers added so far at any point.
    
    EXAMPLE:
    Input: addNum(1), addNum(2), findMedian(), addNum(3), findMedian()
    Output: 1.5, 2.0`,
    
      bruteForceComplexity: `Time Complexity: O(N) per insertion (to keep sorted) — O(N^2) total for N insertions
    Space Complexity: O(N)`,
    
      bruteForceCode: `class MedianFinder {
        private List<Integer> nums = new ArrayList<>();
    
        public void addNum(int num) {
            int pos = 0;
            while (pos < nums.size() && nums.get(pos) < num) pos++; // linear search for insert position
            nums.add(pos, num); // O(N) shift for insertion
        }
    
        public double findMedian() {
            int n = nums.size();
            if (n % 2 == 1) return nums.get(n / 2);
            return (nums.get(n / 2 - 1) + nums.get(n / 2)) / 2.0;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(log N) per insertion, O(1) for findMedian
    Space Complexity: O(N)`,
    
      optimalCode: `Maintain two heaps that always split the numbers into a "lower half" (max-heap, values ≤ median) and "upper half" (min-heap, values ≥ median),
     keeping their sizes balanced (differing by at most 1) after every insertion — so the median is always just the top of the larger heap, or the average
     of both tops when sizes are equal.
      

      class MedianFinder {
        private PriorityQueue<Integer> maxHeap; // lower half, largest on top
        private PriorityQueue<Integer> minHeap; // upper half, smallest on top
    
        public MedianFinder() {
            maxHeap = new PriorityQueue<>(Collections.reverseOrder());
            minHeap = new PriorityQueue<>();
        }
    
        public void addNum(int num) {
            maxHeap.offer(num);
            minHeap.offer(maxHeap.poll()); // balance: move max of lower half to upper half
    
            if (minHeap.size() > maxHeap.size()) { // keep maxHeap size >= minHeap size
                maxHeap.offer(minHeap.poll());
            }
        }
    
        public double findMedian() {
            if (maxHeap.size() > minHeap.size()) return maxHeap.peek();
            return (maxHeap.peek() + minHeap.peek()) / 2.0;
        }
    }`
    },
    
    {
      title: `QUESTION:
    You have K sorted lists. Find the smallest range that includes at least one number from each of the K lists.
    
    EXAMPLE:
    Input: lists = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
    Output: [20,24]`,
    
      bruteForceComplexity: `Time Complexity: O(N^K) — tries all combinations of one element from each list
    Space Complexity: O(K) for indices`,
    
      bruteForceCode: `class Solution {
        int[] bestRange = {Integer.MIN_VALUE, Integer.MAX_VALUE};
    
        public int[] smallestRange(List<List<Integer>> lists) {
            int[] indices = new int[lists.size()];
            tryAllCombinations(lists, indices, 0);
            return bestRange;
        }
    
        // brute-force recursion: try every possible combination of picks (not just moving the min forward)
        private void tryAllCombinations(List<List<Integer>> lists, int[] indices, int listIdx) {
            if (listIdx == lists.size()) {
                int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
                for (int i = 0; i < lists.size(); i++) {
                    int val = lists.get(i).get(indices[i]);
                    min = Math.min(min, val);
                    max = Math.max(max, val);
                }
                if (max - min < bestRange[1] - bestRange[0]) {
                    bestRange = new int[]{min, max};
                }
                return;
            }
            for (int i = 0; i < lists.get(listIdx).size(); i++) { // tries EVERY index in every list -> exponential
                indices[listIdx] = i;
                tryAllCombinations(lists, indices, listIdx + 1);
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log K) — N = total elements across all lists
    Space Complexity: O(K) for the heap`,
    
      optimalCode: `Always pick the current smallest across all lists (via min-heap) and advance only that list, while tracking the running max — because 
      the tightest range that covers all lists must start at some list's minimum, and sliding the global minimum forward one step at a time
     (replacing it with that list's next value) is the only way to potentially shrink the range without ever leaving a list unrepresented.
      
      class Solution {
        public int[] smallestRange(List<List<Integer>> lists) {
            // min-heap of [value, listIndex, elementIndex]
            PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
            int currMax = Integer.MIN_VALUE;
    
            for (int i = 0; i < lists.size(); i++) {
                int val = lists.get(i).get(0);          // i=0: val=4   i=1: val=0   i=2: val=5
                minHeap.offer(new int[]{val, i, 0});     // push (4,0,0), (0,1,0), (5,2,0)
                currMax = Math.max(currMax, val);        // currMax = max(4,0,5) = 5
            }
    
            int[] bestRange = {Integer.MIN_VALUE, Integer.MAX_VALUE};
    
            while (minHeap.size() == lists.size()) {   // 3 == 3 → enter
                int[] curr = minHeap.poll();            // curr = (0,1,0)
                int currMin = curr[0];                  // currMin = 0

                if (currMax - currMin < bestRange[1] - bestRange[0]) {   // 5-0=5 < ∞ → true
                    bestRange = new int[]{currMin, currMax};              // bestRange = [0,5]
                }

                int listIdx = curr[1], elemIdx = curr[2];   // listIdx=1, elemIdx=0
                if (elemIdx + 1 < lists.get(listIdx).size()) {  // 1 < 4 → true (list1 size=4)
                    int nextVal = lists.get(listIdx).get(elemIdx + 1);  // lists[1][1] = 9
                    minHeap.offer(new int[]{nextVal, listIdx, elemIdx + 1});  // push (9,1,1)
                    currMax = Math.max(currMax, nextVal);   // currMax = max(5,9) = 9
                }
            }
            return bestRange;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given an integer array nums and an integer k, return the kth smallest element in the array.
    
    EXAMPLE:
    Input: nums = [3,2,1,5,6,4], k = 2
    Output: 2`,
    
      bruteForceComplexity: `Time Complexity: O(N log N) — sorts the entire array
    Space Complexity: O(log N) to O(N) depending on sort implementation`,
    
      bruteForceCode: `class Solution {
        public int findKthSmallest(int[] nums, int k) {
            int[] sorted = nums.clone();
            Arrays.sort(sorted); // full sort, even though we only need the kth element
            return sorted[k - 1];
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log K)
    Space Complexity: O(K) for the heap`,
    
      optimalCode: `class Solution {
        public int findKthSmallest(int[] nums, int k) {
            // max-heap of size k: keeps the k smallest elements seen so far, largest on top
            PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    
            for (int num : nums) {
                maxHeap.offer(num);
                if (maxHeap.size() > k) maxHeap.poll(); // evict the largest, keeping only k smallest
            }
            return maxHeap.peek(); // top of max-heap is the kth smallest
        }
    }`
    },
    

  ],

  "tries":[
      {
        title: `QUESTION:
    Implement the insert(String word) operation for a Trie (prefix tree) data structure using 26 lowercase English letters per node.
    
    EXAMPLE:
    Input: insert("apple"), insert("app"), insert("apricot")
    Output: Trie contains "apple", "app", "apricot" sharing the common prefix "ap"`,
    
        bruteForceComplexity: `Time Complexity: O(N * L) per insert — scans all existing words to check for duplicates (N = number of words, L = average length)
    Space Complexity: O(N * L) — every word stored fully, no prefix sharing`,
    
        bruteForceCode: `class Solution {
        private List<String> words = new ArrayList<>();
    
        public void insert(String word) {
            // naive: check if word already exists by scanning the whole list
            for (String w : words) {
                if (w.equals(word)) return; // duplicate, skip
            }
            words.add(word); // no prefix sharing, full string stored every time
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(L) — L is the length of the inserted word, independent of how many words already exist
    Space Complexity: O(ALPHABET_SIZE * L) worst case per unique path; shared prefixes reduce overall space`,
    
        optimalCode: `class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEndOfWord = false;
    }
    
    class Solution {
        private TrieNode root = new TrieNode();
    
        public void insert(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) {
                    curr.children[idx] = new TrieNode(); // create node only if path doesn't exist
                }
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true; // mark end after traversing/creating the path
        }
    }`
      },

      {
        title: `QUESTION:
      Given an array of words, find the shortest unique prefix for each word such that the prefix uniquely identifies the word from all others in the array.
      
      EXAMPLE:
      Input: arr = ["zebra", "dog", "duck", "dovc"]
      Output: ["z", "dog", "du", "dov"]
      // "z" is enough since no other word starts with 'z'
      // "dog" needed fully since "dog","duck","dovc" all start with 'd'
      // "du" needed since "duck" and "dovc" both start with 'd','o'... wait "duck" and "dog" both start with 'd' but diverge at 2nd char
      // "dov" needed since "duck" and "dovc" both start with 'd','o' and diverge at 3rd char`,
      
        bruteForceComplexity: `Time Complexity: O(N^2 * L) — for each word, tries every increasing prefix length and compares it against every other word's same-length prefix (N words, L = avg length)
      Space Complexity: O(1) extra (excluding output array)`,
      
        bruteForceCode: `class Solution {
          public String[] findShortestUniquePrefix(String[] arr) {
              String[] result = new String[arr.length];
      
              for (int i = 0; i < arr.length; i++) {
                  String word = arr[i];
                  String prefix = "";
      
                  // try increasing prefix lengths until it's unique
                  for (int len = 1; len <= word.length(); len++) {
                      prefix = word.substring(0, len);
                      boolean isUnique = true;
      
                      // compare this prefix against every other word's same prefix
                      for (int j = 0; j < arr.length; j++) {
                          if (i == j) continue;
                          if (arr[j].length() >= len && arr[j].substring(0, len).equals(prefix)) {
                              isUnique = false;
                              break;
                          }
                      }
      
                      if (isUnique) break; // found shortest unique prefix for this word
                  }
                  result[i] = prefix;
              }
              return result;
          }
      }`,
      
        optimalComplexity: `Time Complexity: O(N * L) — insert all words into a trie while tracking frequency count at each node (O(N*L)), then a second pass walks each word down the trie until hitting a node with freq == 1 (O(N*L))
      Space Complexity: O(ALPHABET_SIZE * N * L) worst case for the trie nodes`,
      
        optimalCode: `class TrieNode {
          TrieNode[] children = new TrieNode[26];
          int freq = 0; // how many words pass through this node
      }
      
      class Solution {
          private TrieNode root = new TrieNode();
      
          public String[] findShortestUniquePrefix(String[] arr) {
              // step 1: insert every word, incrementing freq at each node along the path
              for (String word : arr) {
                  insert(word);
              }
      
              // step 2: for each word, walk down until freq == 1 (that node's path is the unique prefix)
              String[] result = new String[arr.length];
              for (int i = 0; i < arr.length; i++) {
                  result[i] = getUniquePrefix(arr[i]);
              }
              return result;
          }
      
          private void insert(String word) {
              TrieNode curr = root;
              for (char c : word.toCharArray()) {
                  int idx = c - 'a';
                  if (curr.children[idx] == null) {
                      curr.children[idx] = new TrieNode();
                  }
                  curr = curr.children[idx];
                  curr.freq++; // mark that one more word passes through this node
              }
          }
      
          private String getUniquePrefix(String word) {
              TrieNode curr = root;
              StringBuilder prefix = new StringBuilder();
      
              for (char c : word.toCharArray()) {
                  int idx = c - 'a';
                  curr = curr.children[idx];
                  prefix.append(c);
      
                  // as soon as only this one word passes through this node, prefix is unique
                  if (curr.freq == 1) {
                      break;
                  }
              }
              return prefix.toString();
          }
      }`
      },
    
      {
        title: `QUESTION:
    Given a Trie built from a dictionary of words, implement search(String word) that returns true if the exact word exists in the trie.
    
    EXAMPLE:
    Input: insert("apple"); search("apple") -> true; search("app") -> false; search("appl") -> false`,
    
        bruteForceComplexity: `Time Complexity: O(N * L) — compares the target word against every stored word (N words, L = average length)
    Space Complexity: O(N * L) for storing all words in a list`,
    
        bruteForceCode: `class Solution {
        private List<String> words = new ArrayList<>();
    
        public void insert(String word) {
            words.add(word);
        }
    
        public boolean search(String word) {
            // linear scan comparing against every stored word
            for (String w : words) {
                if (w.equals(word)) return true;
            }
            return false;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(L) — traverse one path down the trie matching each character
    Space Complexity: O(ALPHABET_SIZE * N * L) worst case for the trie, shared across common prefixes`,
    
        optimalCode: `class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEndOfWord = false;
    }
    
    class Solution {
        private TrieNode root = new TrieNode();
    
        public void insert(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true;
        }
    
        public boolean search(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) return false; // path doesn't exist
                curr = curr.children[idx];
            }
            return curr.isEndOfWord; // must be a complete word, not just a prefix
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
    
    EXAMPLE:
    Input: s = "leetcode", wordDict = ["leet","code"]
    Output: true // segmented as "leet code"`,
    
        bruteForceComplexity: `Time Complexity: O(2^N) — tries every possible way to partition the string via recursion, no memoization
    Space Complexity: O(N) recursion stack`,
    
        bruteForceCode: `class Solution {
        public boolean wordBreak(String s) {
          if(key.length()==0){
            return true;
          }

          for(int i=1; i<s.length(); i++){
            if(search(s.substring(0, i)) && wordBreak(s.substring(i))){
              return true ;      
            }
          }

          return false;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(N^2) — DP over all substrings; Trie-backed prefix lookup lets invalid branches stop early
    Space Complexity: O(N) for the DP array + O(sum of word lengths) for the Trie`,
    
        optimalCode: `class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEndOfWord = false;
    }
    
    class Solution {
        public boolean wordBreak(String s, List<String> wordDict) {
            TrieNode root = new TrieNode();
            for (String word : wordDict) insert(root, word);
    
            int n = s.length();
            boolean[] dp = new boolean[n + 1];
            dp[0] = true; // empty prefix is always breakable
    
            for (int start = 0; start < n; start++) {
                if (!dp[start]) continue; // skip unreachable starting points
    
                TrieNode curr = root;
                for (int end = start; end < n; end++) {
                    int idx = s.charAt(end) - 'a';
                    if (curr.children[idx] == null) break; // no dict word has this prefix, stop early
                    curr = curr.children[idx];
                    if (curr.isEndOfWord) {
                        dp[end + 1] = true; // valid word ends at 'end'
                    }
                }
            }
            return dp[n];
        }
    
        private void insert(TrieNode root, String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true;
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given an array of strings, find the longest common prefix string amongst all strings using a Trie. If there is no common prefix, return "".
    
    EXAMPLE:
    Input: strs = ["flower","flow","flight"]
    Output: "fl"
                        root
                        |
                      f(3)
                        |
                      l(3)
                     /    \
                  o(2)    i(1)
                   |        |
                 w(2)      g(1)
                /    \       |
             e(1)    ...    h(1)
               |             |
             r(1)           t(1)`,
    
        bruteForceComplexity: `Time Complexity: O(N^2 * S) worst case — repeatedly compares the shrinking prefix against every other string pairwise (S = length of shortest string, N = number of strings)
    Space Complexity: O(1) extra space`,
    
        bruteForceCode: `class Solution {
        public String longestCommonPrefix(String[] strs) {
            if (strs.length == 0) return "";
    
            String prefix = strs[0];
            // repeatedly compare current prefix against every other string, pairwise
            for (int i = 1; i < strs.length; i++) {
                while (!strs[i].startsWith(prefix)) {
                    prefix = prefix.substring(0, prefix.length() - 1); // shrink one char at a time
                    if (prefix.isEmpty()) return "";
                }
            }
            return prefix;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(S) to build the trie (S = total characters across all strings) + O(L) to walk the shared path (L = length of common prefix)
    Space Complexity: O(S) for the trie structure`,
    
        optimalCode: `class TrieNode {
        TrieNode[] children = new TrieNode[26];
        int count = 0; // how many words pass through this node
    }
    
    class Solution {
        public String longestCommonPrefix(String[] strs) {
            if (strs.length == 0) return "";
    
            TrieNode root = new TrieNode();
            for (String word : strs) insert(root, word);
    
            StringBuilder prefix = new StringBuilder();
            TrieNode curr = root;
            while (true) {
                int childIdx = -1, childCount = 0;
                for (int i = 0; i < 26; i++) {
                    if (curr.children[i] != null) {      //when i=5 as (contain f)
                        childIdx = i;
                        childCount++;
                    }
                }
                // stop as soon as branching occurs, or not all strings pass through here
                if (childCount != 1 || curr.count != strs.length) break;      // when it fails directly brek 
                curr = curr.children[childIdx];          // ccur=root.children[5] (f)
                prefix.append((char) ('a' + childIdx));   // append 'f' to prefix ('a' + 5 = 'f')
            }
            return prefix.toString();
        }
    
        private void insert(TrieNode root, String word) {
            TrieNode curr = root;
            curr.count++;               // root count=1 
            for (char c : word.toCharArray()) {
                int idx = c - 'a';                   // for f
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
                curr.count++;                   // f count=1  (for 1st iteration only)
            }
        }
    }`
      },
    
      {
        title: `QUESTION:
    Implement a startsWith(String prefix) method for a Trie that returns true if any inserted word begins with the given prefix.
    
    EXAMPLE:
    Input: insert("apple"); startsWith("app") -> true; startsWith("appl") -> true; startsWith("b") -> false`,
    
        bruteForceComplexity: `Time Complexity: O(N * L) — checks the prefix against every stored word using String.startsWith (N words, L = average length)
    Space Complexity: O(N * L) for storing all words`,
    
        bruteForceCode: `class Solution {
        private List<String> words = new ArrayList<>();
    
        public void insert(String word) {
            words.add(word);
        }
    
        public boolean startsWith(String prefix) {
            // scan every word and check manually
            for (String w : words) {
                if (w.startsWith(prefix)) return true;
            }
            return false;
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(L) — walk the trie one node per character of the prefix
    Space Complexity: O(ALPHABET_SIZE * N * L) worst case for the trie, shared across common prefixes`,
    
        optimalCode: `class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEndOfWord = false;
    }
    
    class Solution {
        private TrieNode root = new TrieNode();
    
        public void insert(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true;
        }
    
        public boolean startsWith(String prefix) {
            TrieNode curr = root;
            for (char c : prefix.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) return false; // path breaks, no word has this prefix
                curr = curr.children[idx];
            }
            return true; // path exists regardless of isEndOfWord
        }
    }`
      },
    
      {
        title: `QUESTION:
    Given a string s, count the number of distinct (unique) non-empty substrings of s.
    
    EXAMPLE:
    Input: s = "aba"
    Output: 5 // "a", "b", "ab", "ba", "aba" ("a" counted once despite appearing twice)`,
    
        bruteForceComplexity: `Time Complexity: O(N^3) — generates all O(N^2) substrings, each hashed/compared in O(N), deduplicated via a HashSet
    Space Complexity: O(N^2) to store all substrings`,
    
        bruteForceCode: `class Solution {
        public int countUniqueSubstrings(String s) {
            Set<String> distinct = new HashSet<>();
            int n = s.length();
    
            // generate every substring and rely on HashSet to remove duplicates
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j <= n; j++) {
                    distinct.add(s.substring(i, j)); // O(N) hashing/comparison cost per substring
                }
            }
            return distinct.size();
        }
    }`,
    
        optimalComplexity: `Time Complexity: O(N^2) — insert all N suffixes into a trie (suffix lengths sum to N + (N-1) + ... + 1 = O(N^2))
    Space Complexity: O(N^2) worst case for the suffix trie nodes`,
    
        optimalCode: `class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
    }
    
    class Solution {
        public int countUniqueSubstrings(String s) {
            TrieNode root = new TrieNode();
            int n = s.length();
            int uniqueCount = 0;
    
            // insert every suffix; each *new* node created represents one distinct substring
            for (int i = 0; i < n; i++) {
                TrieNode curr = root;
                for (int j = i; j < n; j++) {
                    char c = s.charAt(j);
                    if (!curr.children.containsKey(c)) {
                        curr.children.put(c, new TrieNode());
                        uniqueCount++; // new path segment = new distinct substring
                    }
                    curr = curr.children.get(c);
                }
            }
            return uniqueCount;
        }
    }`
    },
    
  
    {
      title: `QUESTION:
    Given an array of strings words, find the longest string in words such that every prefix of it is also present in words. If there are multiple such strings, return the lexicographically smallest one.
    
    EXAMPLE:
    Input: words = ["w","wo","wor","worl","world"]
    Output: "world"`,
    
      bruteForceComplexity: `Time Complexity: O(N^2 * L) — for each word, checks every prefix's existence via linear search in the array
    Space Complexity: O(N) for the word set`,
    
      bruteForceCode: `class Solution {
        public String longestWord(String[] words) {
            Set<String> wordSet = new HashSet<>(Arrays.asList(words));
            String result = "";
    
            for (String word : words) {
                boolean allPrefixesExist = true;
                for (int i = 1; i <= word.length(); i++) { // check every prefix individually
                    if (!wordSet.contains(word.substring(0, i))) {
                        allPrefixesExist = false;
                        break;
                    }
                }
                if (allPrefixesExist) {
                    if (word.length() > result.length() ||
                        (word.length() == result.length() && word.compareTo(result) < 0)) {
                        result = word;
                    }
                }
            }
            return result;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N*L) — N = number of words, L = average word length
    Space Complexity: O(N*L) for the trie`,
    
      optimalCode: `class Solution {
        class TrieNode {
            TrieNode[] children = new TrieNode[26];
            boolean isEndOfWord = false;
        }
    
        private TrieNode root = new TrieNode();
    
        public String longestWord(String[] words) {
            for (String word : words) insert(word);
    
            StringBuilder result = new StringBuilder();
            dfs(root, new StringBuilder(), result);
            return result.toString();
        }
    
        private void insert(String word) {
            TrieNode curr = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true;
        }
    
        // DFS only descends through nodes marked isEndOfWord -> guarantees all prefixes exist
        private void dfs(TrieNode node, StringBuilder path, StringBuilder result) {
            if (path.length() > result.length() ||
                (path.length() == result.length() && path.toString().compareTo(result.toString()) < 0)) {   //for lexicographically
                result.setLength(0);       // to set result to null
                result.append(path);
            }
    
            for (char c = 'a'; c <= 'z'; c++) {
                int idx = c - 'a';             //node(root).children[22].isEndWord=true  its->  w
                if (node.children[idx] != null && node.children[idx].isEndOfWord) {
                    path.append(c);
                    dfs(node.children[idx], path, result);
                    path.deleteCharAt(path.length() - 1); // backtrack
                }
            }
        }
    }`
    },
    
    {
      title: `QUESTION:
    Implement a Phone Directory that supports adding a contact, searching for all contacts matching a given prefix (autocomplete), and deleting a contact.
    
    EXAMPLE:
    Input: add("john"), add("jane"), search("ja"), delete(jane)
    Output: ["jane"]`,
    
      bruteForceComplexity: `Time Complexity: O(N*L) per search — N = number of contacts, L = contact length
    Space Complexity: O(N*L)`,
    
      bruteForceCode: `class PhoneDirectory {
        private List<String> contacts = new ArrayList<>();
    
        public void add(String name) {
            contacts.add(name);
        }
    
        public List<String> search(String prefix) {
            List<String> result = new ArrayList<>();
            for (String contact : contacts) { // linear scan through all contacts every search
                if (contact.startsWith(prefix)) result.add(contact);
            }
            Collections.sort(result);
            return result;
        }
    
        public void delete(String name) {
            contacts.remove(name); // O(N) removal
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(L) for add/delete, O(P + M) for search — P = prefix length, M = number of matches
    Space Complexity: O(total characters across all contacts)`,
    
      optimalCode: `class PhoneDirectory {
        class TrieNode {
            TrieNode[] children = new TrieNode[26];
            boolean isEndOfWord = false;
        }
    
        private TrieNode root = new TrieNode();
    
        public void add(String name) {                  // for insert
            TrieNode curr = root;
            for (char c : name.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.isEndOfWord = true;
        }
    
        public List<String> search(String prefix) {         // serch -> prefix store search word here-> ja
            List<String> result = new ArrayList<>();
            TrieNode node = root;
            for (char c : prefix.toCharArray()) { // navigate directly to prefix node
                int idx = c - 'a';
                if (node.children[idx] == null) return result; // no matches
                node = node.children[idx];
            }
            collectWords(node, new StringBuilder(prefix), result); // (a, prefix("ja"), result)
            return result;
        }
    
        private void collectWords(TrieNode node, StringBuilder path, List<String> result) {
            if (node.isEndOfWord) result.add(path.toString());     // a.isEndOfWord=false
            for (char c = 'a'; c <= 'z'; c++) {                   // a children-> n 
                int idx = c - 'a';
                if (node.children[idx] != null) {
                    path.append(c);
                    collectWords(node.children[idx], path, result);
                    path.deleteCharAt(path.length() - 1);
                }
            }
        }
    
        public void delete(String name) {
            deleteHelper(root, name, 0);
        }
    
        private boolean deleteHelper(TrieNode node, String name, int depth) {  
            if (depth == name.length()) {                // 0== name.length()=4  -> false    (jane)
                if (!node.isEndOfWord) return false;
                node.isEndOfWord = false;
                return isEmpty(node);
            }
            int idx = name.charAt(depth) - 'a';              //name.charAt(0)='j'-'a'  -> idx=9
            TrieNode child = node.children[idx];
            if (child == null) return false;
    
            boolean shouldDeleteChild = deleteHelper(child, name, depth + 1);
            if (shouldDeleteChild) {
                node.children[idx] = null; // prune empty subtree
                return !node.isEndOfWord && isEmpty(node);
            }
            return false;
        }
    
        private boolean isEmpty(TrieNode node) {
            for (TrieNode child : node.children) if (child != null) return false;
            return true;
        }
    }`
    },
    

  ],

  "greedy-algorithm":[

    {
      title: `QUESTION:
    Given N activities with their start and finish times, select the maximum number of activities that can be performed by a single person, assuming a person can only work on a single activity at a time.
    
    EXAMPLE:
    Input: start = [1,3,0,5,8,5], finish = [2,4,6,7,9,9]
    Output: 4  (activities with intervals [1,2],[3,4],[5,7],[8,9])`,
    
      bruteForceComplexity: `Time Complexity: O(2^N) — tries every possible subset of activities and checks for overlaps
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int maxActivities(int[] start, int[] finish) {
            int n = start.length;
            return explore(start, finish, -1, 0, n);
        }
    
        // tries including/excluding every activity, checking overlap against the last chosen one
        private int explore(int[] start, int[] finish, int lastChosen, int index, int n) {
            if (index == n) return 0;
    
            int exclude = explore(start, finish, lastChosen, index + 1, n);
    
            int include = 0;
            if (lastChosen == -1 || start[index] >= finish[lastChosen]) {
                include = 1 + explore(start, finish, index, index + 1, n);
            }
            return Math.max(include, exclude);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — dominated by sorting
    Space Complexity: O(N) for the index array used in sorting`,
    
      optimalCode: `class Solution {
        public int maxActivities(int[] start, int[] finish) {
            int n = start.length;
            Integer[] indices = new Integer[n];
            for (int i = 0; i < n; i++) indices[i] = i;
    
            // greedy: always sort by finish time, always pick the activity that finishes earliest
            Arrays.sort(indices, (a, b) -> finish[a] - finish[b]);
    
            int count = 1;
            int lastFinish = finish[indices[0]];
    
            for (int i = 1; i < n; i++) {
                int idx = indices[i];
                if (start[idx] >= lastFinish) { // no overlap with last selected activity
                    count++;
                    lastFinish = finish[idx];
                }
            }
            return count;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given weights and values of N items and a knapsack of capacity W, find the maximum value that can be put into the knapsack, where items can be broken into fractions (unlike 0/1 knapsack).
    
    EXAMPLE:
    Input: values = [60,100,120], weights = [10,20,30], W = 50
    Output: 240.0`,
    
      bruteForceComplexity: `Time Complexity: O(2^N) — tries every combination of fractions via exhaustive subset exploration
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public double fractionalKnapsack(int[] values, int[] weights, int W) {
            return explore(values, weights, W, 0, values.length);
        }
    
        // tries taking full item, or skipping it entirely -- doesn't exploit fractional property properly
        private double explore(int[] values, int[] weights, int remaining, int index, int n) {
            if (index == n || remaining == 0) return 0;
    
            double skip = explore(values, weights, remaining, index + 1, n);
    
            double take = 0;
            if (weights[index] <= remaining) {
                take = values[index] + explore(values, weights, remaining - weights[index], index + 1, n);
            } else {
                // take a fraction if it doesn't fit fully (only considered at this leaf level, not globally optimal search)
                double fraction = (double) remaining / weights[index];
                take = fraction * values[index];
            }
            return Math.max(take, skip);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — dominated by sorting
    Space Complexity: O(N) for the index array used in sorting`,
    
      optimalCode: `class Solution {
        public double fractionalKnapsack(int[] values, int[] weights, int W) {
            int n = values.length;
            Integer[] indices = new Integer[n];
            for (int i = 0; i < n; i++) indices[i] = i;
    
            // greedy: always sort by value/weight ratio descending, always take the best ratio first
            Arrays.sort(indices, (a, b) -> Double.compare(
                (double) values[b] / weights[b], (double) values[a] / weights[a]));
    
            double totalValue = 0;
            int remaining = W;
    
            for (int idx : indices) {
                if (remaining <= 0) break;
                if (weights[idx] <= remaining) {
                    totalValue += values[idx]; // take whole item
                    remaining -= weights[idx];
                } else {
                    totalValue += values[idx] * ((double) remaining / weights[idx]); // take fraction to fill remaining capacity
                    remaining = 0;
                }
            }
            return totalValue;
        }
    }`
    },
    
    {
      title: `QUESTION:
    You are given N pairs of numbers. In every pair, the first number is smaller than the second. A pair (c,d) can follow another pair (a,b) if b < c. Find the length of the longest chain that can be formed from the given set of pairs.
    
    EXAMPLE:
    Input: pairs = [[5,24],[39,60],[15,28],[27,40],[50,90]]
    Output: 3  (chain: [5,24] -> [27,40] -> [50,90])`,
    
      bruteForceComplexity: `Time Complexity: O(2^N) — tries every subset of pairs and checks validity of the chain
    Space Complexity: O(N) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int maxChainLength(int[][] pairs) {
            return explore(pairs, -1, 0, pairs.length);
        }
    
        // tries including/excluding every pair, checking chain validity against last chosen pair
        private int explore(int[][] pairs, int lastChosen, int index, int n) {
            if (index == n) return 0;
    
            int exclude = explore(pairs, lastChosen, index + 1, n);
    
            int include = 0;
            if (lastChosen == -1 || pairs[index][0] > pairs[lastChosen][1]) {
                include = 1 + explore(pairs, index, index + 1, n);
            }
            return Math.max(include, exclude);
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — dominated by sorting
    Space Complexity: O(1) extra (excluding sort space)`,
    
      optimalCode: `class Solution {
        public int maxChainLength(int[][] pairs) {
            // greedy: sort by second element (like activity selection) -- always pick pair that ends earliest
            Arrays.sort(pairs, (a, b) -> a[1] - b[1]);
    
            int count = 1;
            int lastEnd = pairs[0][1];
    
            for (int i = 1; i < pairs.length; i++) {
                if (pairs[i][0] > lastEnd) { // valid continuation of the chain
                    count++;
                    lastEnd = pairs[i][1];
                }
            }
            return count;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a value V and an array of Indian currency denominations (coins), find the minimum number of coins/notes needed to make the value V (assume infinite supply of each denomination).
    
    EXAMPLE:
    Input: V = 93, coins = [1,2,5,10,20,50,100,500,1000]
    Output: 5  (50 + 20 + 20 + 2 + 1)`,
    
      bruteForceComplexity: `Time Complexity: O(2^V) — tries every combination of coin counts via exhaustive recursion
    Space Complexity: O(V) recursion stack`,
    
      bruteForceCode: `class Solution {
        public int minCoins(int V, int[] coins) {
            if (V == 0) return 0;
            int minCount = Integer.MAX_VALUE;
    
            for (int coin : coins) { // tries every coin at every step, exponential blowup
                if (coin <= V) {
                    int result = minCoins(V - coin, coins);
                    if (result != Integer.MAX_VALUE) {
                        minCount = Math.min(minCount, result + 1);
                    }
                }
            }
            return minCount;
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N + V/smallest_coin) — sorting + greedy pass (works correctly because Indian denominations are canonical)
    Space Complexity: O(1) extra`,
    
      optimalCode: `class Solution {
        public int minCoins(int V, int[] coins) {
            Integer[] sortedCoins = Arrays.stream(coins).boxed().toArray(Integer[]::new);
            Arrays.sort(sortedCoins, Collections.reverseOrder()); // largest denomination first
    
            int count = 0;
            for (int coin : sortedCoins) {
                while (V >= coin) { // greedily use largest coin as many times as possible
                    V -= coin;
                    count++;
                }
            }
            return count;
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given a set of N jobs where each job has a deadline and profit, and each job takes exactly 1 unit of time, find the maximum profit and the number of jobs done by scheduling jobs such that a job can only be scheduled at a time before or on its deadline (only one job can be scheduled at a time).
    
    EXAMPLE:
    Input: jobs = [(1,4,20),(2,1,10),(3,1,40),(4,1,30)] (id, deadline, profit)
    Output: 2 jobs, 60 profit`,
    
      bruteForceComplexity: `Time Complexity: O(2^N * maxDeadline) — tries every subset of jobs and every valid slot assignment
    Space Complexity: O(maxDeadline) for slot tracking`,
    
      bruteForceCode: `class Solution {
        public int[] jobSequencing(int[] deadlines, int[] profits) {
            int n = deadlines.length;
            int maxDeadline = Arrays.stream(deadlines).max().getAsInt();
            boolean[] slots = new boolean[maxDeadline + 1];
    
            int[] best = {0, 0}; // count, profit
            explore(deadlines, profits, 0, n, slots, 0, 0, best);
            return best;
        }
    
        // tries including/excluding every job at every possible slot -- exponential
        private void explore(int[] deadlines, int[] profits, int index, int n, boolean[] slots, int count, int profit, int[] best) {
            if (index == n) {
                if (profit > best[1]) { best[0] = count; best[1] = profit; }
                return;
            }
    
            explore(deadlines, profits, index + 1, n, slots, count, profit, best); // skip job
    
            for (int slot = deadlines[index]; slot >= 1; slot--) { // try every slot up to deadline
                if (!slots[slot]) {
                    slots[slot] = true;
                    explore(deadlines, profits, index + 1, n, slots, count + 1, profit + profits[index], best);
                    slots[slot] = false; // backtrack
                    break;
                }
            }
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N + N * maxDeadline)
    Space Complexity: O(maxDeadline) for slot tracking`,
    
      optimalCode: `class Solution {
        public int[] jobSequencing(int[] deadlines, int[] profits) {
            int n = deadlines.length;
            Integer[] indices = new Integer[n];
            for (int i = 0; i < n; i++) indices[i] = i;
    
            // greedy: sort jobs by profit descending, always try to schedule the most profitable job first
            Arrays.sort(indices, (a, b) -> profits[b] - profits[a]);
    
            int maxDeadline = Arrays.stream(deadlines).max().getAsInt();
            boolean[] slots = new boolean[maxDeadline + 1];
    
            int count = 0, totalProfit = 0;
    
            for (int idx : indices) {
                // try to place job in the latest available slot at or before its deadline
                for (int slot = deadlines[idx]; slot >= 1; slot--) {
                    if (!slots[slot]) {
                        slots[slot] = true;
                        count++;
                        totalProfit += profits[idx];
                        break;
                    }
                }
            }
            return new int[]{count, totalProfit};
        }
    }`
    },
    
    {
      title: `QUESTION:
    Given N packets of chocolates with different quantities and M students, distribute packets such that each student gets exactly one packet, and the difference between the maximum and minimum chocolates given to a student is minimized.
    
    EXAMPLE:
    Input: chocolates = [3,4,1,9,56,7,9,12], M = 5
    Output: 6  (packets [3,4,7,9,9] -> max-min = 9-3 = 6)`,
    
      bruteForceComplexity: `Time Complexity: O(N choose M) — tries every possible combination of M packets out of N
    Space Complexity: O(M) recursion stack`,
    
      bruteForceCode: `class Solution {
        int minDiff = Integer.MAX_VALUE;
    
        public int findMinDiff(int[] chocolates, int M) {
            explore(chocolates, M, 0, new ArrayList<>());
            return minDiff;
        }
    
        // tries every combination of M packets, exponential
        private void explore(int[] chocolates, int M, int index, List<Integer> current) {
            if (current.size() == M) {
                int max = Collections.max(current);
                int min = Collections.min(current);
                minDiff = Math.min(minDiff, max - min);
                return;
            }
            if (index == chocolates.length) return;
    
            current.add(chocolates[index]);
            explore(chocolates, M, index + 1, current); // include
            current.remove(current.size() - 1);
    
            explore(chocolates, M, index + 1, current); // exclude
        }
    }`,
    
      optimalComplexity: `Time Complexity: O(N log N) — dominated by sorting
    Space Complexity: O(1) extra (excluding sort space)`,
    
      optimalCode: `class Solution {
        public int findMinDiff(int[] chocolates, int M) {
            if (M == 0 || chocolates.length == 0) return 0;
    
            Arrays.sort(chocolates); // greedy: sorted packets means any window of size M is a candidate
    
            int minDiff = Integer.MAX_VALUE;
            // slide a window of size M across sorted array -- min diff only needs adjacent windows checked
            for (int i = 0; i + M - 1 < chocolates.length; i++) {
                int diff = chocolates[i + M - 1] - chocolates[i];
                minDiff = Math.min(minDiff, diff);
            }
            return minDiff;
        }
    }`
    },
  ],

  "segment-tree": [

        {
            title: `QUESTION:
    Given an integer array nums, build a Segment Tree that supports finding the sum of elements in any given range [left, right].

    EXAMPLE:
    Input: nums = [1, 3, 5, 7, 9, 11]
    Query: sum(1, 3)

    Output: 15

    Explanation:
    nums[1] + nums[2] + nums[3]
    = 3 + 5 + 7
    = 15

    A Segment Tree stores information about different ranges of the array so that range queries can be answered efficiently.`,

            bruteForceComplexity: `Time Complexity: O(N) per query
    - Traverse every element from left to right and calculate the sum.

    Space Complexity: O(1)`,

            bruteForceCode: `
    class Solution {
        public int rangeSum(int[] nums, int left, int right) {
            int sum = 0;
            for (int i = left; i <= right; i++) {
                sum += nums[i];
            }
            return sum;
        }
    }`,

            optimalComplexity: `Build:
    Time Complexity: O(N)

    Range Sum Query:
    Time Complexity: O(log N)

    Point Update:
    Time Complexity: O(log N)

    Space Complexity: O(N)
    - Segment Tree generally uses approximately 4*N space.`,

            optimalCode: `
    class SegmentTree {
        int[] tree;
        int n;

        SegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return 0;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            int leftSum = query(2 * node + 1, start, mid, left, right);
            int rightSum = query(2 * node + 2, mid + 1, end, left, right);

            return leftSum + rightSum;
        }

        void update(int index, int value) {
            update(0, 0, n - 1, index, value);
        }

        void update(int node, int start, int end, int index, int value) {
            if (start == end) {
                tree[node] = value;
                return;
            }

            int mid = start + (end - start) / 2;

            if (index <= mid)
                update(2 * node + 1, start, mid, index, value);
            else
                update(2 * node + 2, mid + 1, end, index, value);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }` 
        },

        {
            title: `QUESTION:
    Understand the basic structure of a Segment Tree.

    EXAMPLE:
    nums = [1, 3, 5, 7]

    Segment Tree:

                        [0,3] = 16
                    /          \\
                [0,1] = 4       [2,3] = 12
                /    \\          /      \\
            [0,0]=1 [1,1]=3 [2,2]=5 [3,3]=7

    Each node represents a range.

    Root represents [0,3].
    Left child represents [0,1].
    Right child represents [2,3].

    The array is repeatedly divided into two halves until every leaf represents one element.

    For a sum Segment Tree:
    parent = left child + right child.`,

            bruteForceComplexity: `Without a Segment Tree, a range query may require checking every element.

    Range Query:
    O(N)`,

            bruteForceCode: ``,

            optimalComplexity: `Build:
    O(N)

    Range Query:
    O(log N)

    Point Update:
    O(log N)

    Space:
    O(N)`,

            optimalCode: `
    class SegmentTree {
        int[] tree;

        SegmentTree(int[] nums) {
            tree = new int[4 * nums.length];
            build(nums, 0, 0, nums.length - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }` 
        },

        {
            title: `QUESTION:
    Perform a range sum query using a Segment Tree.

    Input:
    nums = [1, 3, 5, 7, 9, 11]

    Query:
    sum(1, 4)

    Output:
    24

    Explanation:
    3 + 5 + 7 + 9 = 24

    During a query, every segment falls into one of three cases:

    1. Completely outside → return 0.
    2. Completely inside → return tree[node].
    3. Partially overlapping → go to both children.`,

            bruteForceComplexity: `Time Complexity: O(N)
    - Traverse all elements in the requested range.

    Space Complexity: O(1)`,

            bruteForceCode: `
    int sum = 0;
    for (int i = left; i <= right; i++) {
        sum += nums[i];
    }
    return sum;`,

            optimalComplexity: `Time Complexity: O(log N)
    - The Segment Tree allows us to skip complete segments.

    Space Complexity:
    O(log N) recursion stack.`,

            optimalCode: `
    class SegmentTree {
        int[] tree;
        int n;

        SegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return 0;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            int leftSum = query(2 * node + 1, start, mid, left, right);
            int rightSum = query(2 * node + 2, mid + 1, end, left, right);

            return leftSum + rightSum;
        }
    }` 
        },

        {
            title: `QUESTION:
    Perform a point update in a Segment Tree.

    Input:
    nums = [1, 3, 5, 7, 9]

    Update:
    nums[2] = 10

    New array:
    [1, 3, 10, 7, 9]

    Only the nodes containing index 2 need to be changed.

    We travel from the root to the required leaf and then recalculate all its ancestors.`,

            bruteForceComplexity: `If the whole Segment Tree is rebuilt after every update:

    Time Complexity:
    O(N)

    This becomes inefficient when there are many updates.`,

            bruteForceCode: `
    nums[index] = value;`,

            optimalComplexity: `Time Complexity: O(log N)
    - Only one path from root to leaf is updated.

    Space Complexity:
    O(log N) recursion stack.`,

            optimalCode: `
    class SegmentTree {
        int[] tree;
        int n;

        SegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        void update(int index, int value) {
            update(0, 0, n - 1, index, value);
        }

        void update(int node, int start, int end, int index, int value) {
            if (start == end) {
                tree[node] = value;
                return;
            }

            int mid = start + (end - start) / 2;

            if (index <= mid)
                update(2 * node + 1, start, mid, index, value);
            else
                update(2 * node + 2, mid + 1, end, index, value);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }
    }` 
        },

        {
            title: `QUESTION:
    Find the minimum value in a given range using a Segment Tree.

    Input:
    nums = [5, 2, 7, 1, 6, 3]

    Query:
    minimum(1, 4)

    Output:
    1

    For a minimum Segment Tree:
    tree[node] = min(leftChild, rightChild)

    For a completely outside range, return Integer.MAX_VALUE because it does not affect the minimum.`,

            bruteForceComplexity: `Time Complexity: O(N) per query

    Space Complexity: O(1)`,

            bruteForceCode: `
    int answer = Integer.MAX_VALUE;
    for (int i = left; i <= right; i++) {
        answer = Math.min(answer, nums[i]);
    }
    return answer;`,

            optimalComplexity: `Build:
    O(N)

    Range Minimum Query:
    O(log N)

    Point Update:
    O(log N)

    Space:
    O(N)`,

            optimalCode: `
    class SegmentTree {
        int[] tree;
        int n;

        SegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = Math.min(tree[2 * node + 1], tree[2 * node + 2]);
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return Integer.MAX_VALUE;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            int leftMin = query(2 * node + 1, start, mid, left, right);
            int rightMin = query(2 * node + 2, mid + 1, end, left, right);

            return Math.min(leftMin, rightMin);
        }

        void update(int index, int value) {
            update(0, 0, n - 1, index, value);
        }

        void update(int node, int start, int end, int index, int value) {
            if (start == end) {
                tree[node] = value;
                return;
            }

            int mid = start + (end - start) / 2;

            if (index <= mid)
                update(2 * node + 1, start, mid, index, value);
            else
                update(2 * node + 2, mid + 1, end, index, value);

            tree[node] = Math.min(tree[2 * node + 1], tree[2 * node + 2]);
        }
    }` 
        },

        {
            title: `QUESTION:
    Find the maximum value in a range using a Segment Tree.

    Input:
    nums = [2, 8, 1, 6, 4, 9]

    Query:
    maximum(1, 4)

    Output:
    8

    For a maximum Segment Tree:
    tree[node] = max(leftChild, rightChild)

    For a completely outside range, return Integer.MIN_VALUE.`,

            bruteForceComplexity: `Time Complexity: O(N) per query

    Space Complexity: O(1)`,

            bruteForceCode: `
    int answer = Integer.MIN_VALUE;
    for (int i = left; i <= right; i++) {
        answer = Math.max(answer, nums[i]);
    }
    return answer;`,

            optimalComplexity: `Build:
    O(N)

    Range Maximum Query:
    O(log N)

    Point Update:
    O(log N)

    Space:
    O(N)`,

            optimalCode: `
    class SegmentTree {
        int[] tree;
        int n;

        SegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = Math.max(tree[2 * node + 1], tree[2 * node + 2]);
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return Integer.MIN_VALUE;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            int leftMax = query(2 * node + 1, start, mid, left, right);
            int rightMax = query(2 * node + 2, mid + 1, end, left, right);

            return Math.max(leftMax, rightMax);
        }

        void update(int index, int value) {
            update(0, 0, n - 1, index, value);
        }

        void update(int node, int start, int end, int index, int value) {
            if (start == end) {
                tree[node] = value;
                return;
            }

            int mid = start + (end - start) / 2;

            if (index <= mid)
                update(2 * node + 1, start, mid, index, value);
            else
                update(2 * node + 2, mid + 1, end, index, value);

            tree[node] = Math.max(tree[2 * node + 1], tree[2 * node + 2]);
        }
    }` 
        },

        {
            title: `QUESTION:
    Implement a Segment Tree with Lazy Propagation.

    Operations:
    1. Add value to every element in a range [left, right].
    2. Find the sum of elements in a range [left, right].

    EXAMPLE:
    nums = [1, 2, 3, 4, 5]

    Update:
    add 2 to [1, 3]

    Array becomes:
    [1, 4, 5, 6, 5]

    Query:
    sum(1, 3)

    Output:
    15

    Lazy propagation avoids updating every element individually.

    We store pending updates in lazy[node].
    When a segment is needed, we push the pending update to its children.`,

            bruteForceComplexity: `Range Update:
    O(N)

    Range Query:
    O(N)

    With many operations, this becomes slow.`,

            bruteForceCode: `
    for (int i = left; i <= right; i++) {
        nums[i] += value;
    }`,

            optimalComplexity: `Build:
    O(N)

    Range Update:
    O(log N)

    Range Sum Query:
    O(log N)

    Space:
    O(N)

    Lazy propagation makes range updates efficient.`,

            optimalCode: `
    class LazySegmentTree {
        long[] tree;
        long[] lazy;
        int n;

        LazySegmentTree(int[] nums) {
            n = nums.length;
            tree = new long[4 * n];
            lazy = new long[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        void push(int node, int start, int end) {
            if (lazy[node] == 0) return;

            long value = lazy[node];
            tree[node] += (end - start + 1) * value;

            if (start != end) {
                lazy[2 * node + 1] += value;
                lazy[2 * node + 2] += value;
            }

            lazy[node] = 0;
        }

        void update(int left, int right, int value) {
            update(0, 0, n - 1, left, right, value);
        }

        void update(int node, int start, int end, int left, int right, int value) {
            push(node, start, end);

            if (right < start || end < left) return;

            if (left <= start && end <= right) {
                lazy[node] += value;
                push(node, start, end);
                return;
            }

            int mid = start + (end - start) / 2;
            update(2 * node + 1, start, mid, left, right, value);
            update(2 * node + 2, mid + 1, end, left, right, value);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        long query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        long query(int node, int start, int end, int left, int right) {
            push(node, start, end);

            if (right < start || end < left) return 0;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            long leftSum = query(2 * node + 1, start, mid, left, right);
            long rightSum = query(2 * node + 2, mid + 1, end, left, right);

            return leftSum + rightSum;
        }
    }` 
        },

        {
            title: `QUESTION:
    Implement a Segment Tree for Range Add Update and Range Minimum Query using Lazy Propagation.

    Input:
    nums = [1, 3, 5, 7, 9]

    Operation:
    Add 4 to range [1, 3]

    Array becomes:
    [1, 7, 9, 11, 9]

    Query:
    minimum(1, 3)

    Output:
    7

    The tree stores minimum values.

    For a range update, instead of changing every element immediately, we store the pending addition in lazy[node].`,

            bruteForceComplexity: `Range Update:
    O(N)

    Range Minimum Query:
    O(N)`,

            bruteForceCode: `
    for (int i = left; i <= right; i++) {
        nums[i] += value;
    }

    int answer = Integer.MAX_VALUE;
    for (int i = left; i <= right; i++) {
        answer = Math.min(answer, nums[i]);
    }
    return answer;`,

            optimalComplexity: `Build:
    O(N)

    Range Add:
    O(log N)

    Range Minimum Query:
    O(log N)

    Space:
    O(N)`,

            optimalCode: `
    class LazyMinSegmentTree {
        long[] tree;
        long[] lazy;
        int n;

        LazyMinSegmentTree(int[] nums) {
            n = nums.length;
            tree = new long[4 * n];
            lazy = new long[4 * n];
            build(nums, 0, 0, n - 1);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = Math.min(tree[2 * node + 1], tree[2 * node + 2]);
        }

        void push(int node) {
            if (lazy[node] == 0) return;

            long value = lazy[node];
            tree[2 * node + 1] += value;
            tree[2 * node + 2] += value;
            lazy[2 * node + 1] += value;
            lazy[2 * node + 2] += value;

            lazy[node] = 0;
        }

        void update(int left, int right, int value) {
            update(0, 0, n - 1, left, right, value);
        }

        void update(int node, int start, int end, int left, int right, int value) {
            if (right < start || end < left) return;

            if (left <= start && end <= right) {
                tree[node] += value;
                lazy[node] += value;
                return;
            }

            push(node);

            int mid = start + (end - start) / 2;
            update(2 * node + 1, start, mid, left, right, value);
            update(2 * node + 2, mid + 1, end, left, right, value);

            tree[node] = Math.min(tree[2 * node + 1], tree[2 * node + 2]);
        }

        long query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        long query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return Long.MAX_VALUE;
            if (left <= start && end <= right) return tree[node];

            push(node);

            int mid = start + (end - start) / 2;
            long leftMin = query(2 * node + 1, start, mid, left, right);
            long rightMin = query(2 * node + 2, mid + 1, end, left, right);

            return Math.min(leftMin, rightMin);
        }
    }` 
        },

        {
            title: `QUESTION:
    Implement a Segment Tree for GCD queries.

    Input:
    nums = [12, 18, 6, 24, 30]

    Query:
    GCD(1, 4)

    Output:
    6

    A Segment Tree can store GCD instead of sum.

    For every parent:
    tree[node] = gcd(leftChild, rightChild)

    For a completely outside range, return 0 because gcd(x, 0) = x.`,

            bruteForceComplexity: `Time Complexity:
    O(N) per query

    Space Complexity:
    O(1)`,

            bruteForceCode: `
    int answer = nums[left];
    for (int i = left + 1; i <= right; i++) {
        answer = gcd(answer, nums[i]);
    }
    return answer;`,

            optimalComplexity: `Build:
    O(N)

    GCD Query:
    O(log N * log V)

    Point Update:
    O(log N * log V)

    V = maximum value in the array.`,

            optimalCode: `
    class GCDSegmentTree {
        int[] tree;
        int n;

        GCDSegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(nums, 0, 0, n - 1);
        }

        int gcd(int a, int b) {
            while (b != 0) {
                int temp = a % b;
                a = b;
                b = temp;
            }
            return Math.abs(a);
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = nums[start];
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = gcd(tree[2 * node + 1], tree[2 * node + 2]);
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return 0;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            int leftGcd = query(2 * node + 1, start, mid, left, right);
            int rightGcd = query(2 * node + 2, mid + 1, end, left, right);

            return gcd(leftGcd, rightGcd);
        }

        void update(int index, int value) {
            update(0, 0, n - 1, index, value);
        }

        void update(int node, int start, int end, int index, int value) {
            if (start == end) {
                tree[node] = value;
                return;
            }

            int mid = start + (end - start) / 2;

            if (index <= mid)
                update(2 * node + 1, start, mid, index, value);
            else
                update(2 * node + 2, mid + 1, end, index, value);

            tree[node] = gcd(tree[2 * node + 1], tree[2 * node + 2]);
        }
    }` 
        },

        {
            title: `QUESTION:
    Find the number of elements in a range using a Segment Tree.

    Input:
    nums = [1, 2, 3, 4, 5]

    Query:
    count(1, 3)

    Output:
    3

    A Segment Tree can store count/frequency information.

    Each leaf stores 1 because every position contains one element.

    Each parent stores:
    leftCount + rightCount.`,

            bruteForceComplexity: `Time Complexity:
    O(N)

    Space Complexity:
    O(1)`,

            bruteForceCode: `
    int count = 0;
    for (int i = left; i <= right; i++) {
        count++;
    }
    return count;`,

            optimalComplexity: `Build:
    O(N)

    Range Count Query:
    O(log N)

    Point Update:
    O(log N)

    Space:
    O(N)`,

            optimalCode: `
    class CountSegmentTree {
        int[] tree;
        int n;

        CountSegmentTree(int[] nums) {
            n = nums.length;
            tree = new int[4 * n];
            build(0, 0, n - 1);
        }

        void build(int node, int start, int end) {
            if (start == end) {
                tree[node] = 1;
                return;
            }

            int mid = start + (end - start) / 2;
            build(2 * node + 1, start, mid);
            build(2 * node + 2, mid + 1, end);

            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return 0;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            return query(2 * node + 1, start, mid, left, right)
                + query(2 * node + 2, mid + 1, end, left, right);
        }
    }` 
        },

        {
            title: `QUESTION:
    Find the maximum subarray sum in a range using a Segment Tree.

    Input:
    nums = [-2, 3, -1, 5, -6, 4]

    Query:
    maximumSubarraySum(0, 3)

    Output:
    7

    Explanation:
    The best subarray is [3, -1, 5]
    Sum = 7

    For this problem each Segment Tree node stores four values:

    sum = total sum of the segment
    prefix = maximum prefix sum
    suffix = maximum suffix sum
    answer = maximum subarray sum

    When combining two nodes, we calculate these four values from the left and right children.`,

            bruteForceComplexity: `For every query, check all possible subarrays.

    Time Complexity:
    O(N²) per query.

    Space Complexity:
    O(1)`,

            bruteForceCode: `
    int answer = Integer.MIN_VALUE;

    for (int i = left; i <= right; i++) {
        int sum = 0;
        for (int j = i; j <= right; j++) {
            sum += nums[j];
            answer = Math.max(answer, sum);
        }
    }

    return answer;`,

            optimalComplexity: `Build:
    O(N)

    Range Maximum Subarray Query:
    O(log N)

    Point Update:
    O(log N)

    Space:
    O(N)`,

            optimalCode: `
    class SegmentTree {
        class Node {
            int sum, prefix, suffix, answer;

            Node(int value) {
                sum = prefix = suffix = answer = value;
            }
        }

        Node[] tree;
        int n;

        SegmentTree(int[] nums) {
            n = nums.length;
            tree = new Node[4 * n];
            build(nums, 0, 0, n - 1);
        }

        Node merge(Node left, Node right) {
            Node result = new Node(0);

            result.sum = left.sum + right.sum;
            result.prefix = Math.max(left.prefix, left.sum + right.prefix);
            result.suffix = Math.max(right.suffix, right.sum + left.suffix);
            result.answer = Math.max(Math.max(left.answer, right.answer), left.suffix + right.prefix);

            return result;
        }

        void build(int[] nums, int node, int start, int end) {
            if (start == end) {
                tree[node] = new Node(nums[start]);
                return;
            }

            int mid = start + (end - start) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);

            tree[node] = merge(tree[2 * node + 1], tree[2 * node + 2]);
        }

        Node query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }

        Node query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) return null;
            if (left <= start && end <= right) return tree[node];

            int mid = start + (end - start) / 2;
            Node leftNode = query(2 * node + 1, start, mid, left, right);
            Node rightNode = query(2 * node + 2, mid + 1, end, left, right);

            if (leftNode == null) return rightNode;
            if (rightNode == null) return leftNode;

            return merge(leftNode, rightNode);
        }
    }` 
        }

    ],
  
  };
  
  export default questionsData;