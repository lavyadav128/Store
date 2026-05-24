const questionsData = {

    "multiplications":[
      {
        "title": "What is the base method multiplication trick?",
        "answer": "The base method is a fast multiplication trick used when numbers are close to bases like 10, 50, 100, 1000, etc. Instead of doing long multiplication, we compare each number with the nearest base and use their differences. This makes calculations much faster and easier mentally."
      },
      {
        "title": "Why do we use bases like 10, 50, 100, and 1000?",
        "answer": "These numbers are easy to work with because they are round numbers. Bases having zeros (10, 100, 1000) are especially useful because the number of zeros tells us how many digits we must keep on the right side of the final answer."
      },
      {
        "title": "What are the steps of the base method?",
        "answer": "Step 1: Choose a nearby base. Step 2: Find how much each number is above (+) or below (-) the base. Step 3: Cross add or cross subtract the numbers. Step 4: Multiply the differences. Step 5: Combine left and right parts carefully."
      },
      {
        "title": "How do we solve 103 × 107 using base 100?",
        "answer": "Base = 100. 103 is +3 above 100 and 107 is +7 above 100. Cross add: 103 + 7 = 110 (or 107 + 3 = 110). Multiply differences: 3 × 7 = 21. Since base 100 has 2 zeros, keep 2 digits on the right side. Final answer = 11021."
      },
      {
        "title": "Why does base 100 require 2 digits on the right side?",
        "answer": "Because 100 has 2 zeros. So the right side must always contain exactly 2 digits. Example: 3 × 4 = 12 (already 2 digits). But if result is 5, we write 05."
      },
      {
        "title": "How do we solve 91 × 87 using base 100?",
        "answer": "Base = 100. 91 is -9 below 100 and 87 is -13 below 100. Cross subtract: 91 - 13 = 78 (or 87 - 9 = 78). Multiply differences: (-9) × (-13) = +117. Since base 100 needs 2 digits on the right side, write 17 and carry 1 to the left side. Left side becomes 78 + 1 = 79. Final answer = 7917."
      },
      {
        "title": "Why do we carry extra digits in the right part?",
        "answer": "The right side must contain only the number of digits decided by the base. For base 100, only 2 digits are allowed. If multiplication gives 117, we keep 17 on the right and carry 1 to the left."
      },
      {
        "title": "How do signs work in the base method?",
        "answer": "If both numbers are above the base, both differences are positive and multiplication stays positive. If both are below the base, both differences are negative and multiplication again becomes positive. If one number is above and the other is below, multiplication becomes negative."
      },
      {
        "title": "How do we solve numbers when one is above and one is below the base?",
        "answer": "Example: 103 × 97 using base 100. 103 is +3 and 97 is -3. Cross add/subtract: 103 - 3 = 100. Multiply differences: (+3) × (-3) = -9. Since the right side is negative, borrow 1 from the left side. Left becomes 99 and right becomes 91. Final answer = 9991."
      },
      {
        "title": "Can we use bases other than 10, 100, and 1000?",
        "answer": "Yes. We can also use bases like 50, 200, 500, etc. But these are not pure power-of-10 bases, so sometimes we adjust the answer by multiplication or division."
      },
      {
        "title": "How do we solve 48 × 44 using base 50?",
        "answer": "Base = 50. 48 is -2 below 50 and 44 is -6 below 50. Cross subtract: 48 - 6 = 42 (or 44 - 2 = 42). Multiply differences: (-2) × (-6) = 12. Since 50 is half of 100, we multiply the left part by 50 and then add the right part. 42 × 50 = 2100. Add 12 → 2100 + 12 = 2112. Final answer = 2112."
      },
      {
        "title": "Why is base 50 slightly different from base 100?",
        "answer": "Because 50 is not a power of 10. Bases like 10, 100, and 1000 directly decide right-side digits using zeros. But for 50, we usually calculate the left part and then multiply it with 50 before adding the right-side multiplication."
      },
      {
        "title": "What is the biggest advantage of the base method?",
        "answer": "It makes multiplication very fast in mental math, especially when numbers are close to a common base. Competitive exam students use it to save a lot of time."
      }
    ],


      
    "squaring": [
      {
        "title": "What is the squaring trick using base method?",
        "answer": "The base method squaring trick helps us quickly find the square of numbers close to bases like 10, 100, 1000, etc. Instead of normal multiplication, we use the number’s difference from the base. This makes calculations very fast and easy in mental math."
      },
      {
        "title": "Why do we use bases like 10, 100, and 1000 for squaring?",
        "answer": "These are round numbers and easy to calculate with. The number of zeros in the base tells us how many digits must appear on the right side of the answer. Base 10 → 1 digit, Base 100 → 2 digits, Base 1000 → 3 digits."
      },
      {
        "title": "What are the steps for squaring numbers near a base?",
        "answer": "Step 1: Choose the nearest base. Step 2: Find how much the number is above (+) or below (-) the base. Step 3: Left part = number ± difference. Step 4: Right part = square of the difference. Step 5: Keep fixed digits on the right side according to the base."
      },
      {
        "title": "How do we square numbers below 100?",
        "answer": "If a number is below 100, subtract its difference from the number itself for the left part. Then square the difference for the right part."
      },
      {
        "title": "How do we find 98²?",
        "answer": "Base = 100. 98 is 2 below 100, so difference = -2. Left part: 98 - 2 = 96. Right part: 2² = 04. Since base 100 has 2 zeros, keep 2 digits on the right side. Final answer = 9604."
      },
      {
        "title": "How do we find 97²?",
        "answer": "Base = 100. 97 is -3 from 100. Left part: 97 - 3 = 94. Right part: 3² = 09. Final answer = 9409."
      },
      {
        "title": "How do we square numbers above 100?",
        "answer": "If a number is above 100, add its difference to the number for the left part. Then square the difference for the right part."
      },
      {
        "title": "How do we find 103²?",
        "answer": "Base = 100. 103 is +3 above 100. Left part: 103 + 3 = 106. Right part: 3² = 09. Since base 100 needs 2 digits on the right side, write 09. Final answer = 10609."
      },
      {
        "title": "How do we find 112²?",
        "answer": "Base = 100. 112 is +12 from 100. Left part: 112 + 12 = 124. Right part: 12² = 144. Since base 100 allows only 2 digits on the right side, keep 44 and carry 1 to the left side. Left becomes 125. Final answer = 12544."
      },
      {
        "title": "How do we find 87²?",
        "answer": "Base = 100. 87 is -13 below 100. Left part: 87 - 13 = 74. Right part: 13² = 169. Base 100 allows only 2 digits on the right side, so keep 69 and carry 1 to the left side. Left becomes 75. Final answer = 7569."
      },
      {
        "title": "Why do we keep fixed digits on the right side?",
        "answer": "The base decides the number of right-side digits. Base 10 → 1 digit, Base 100 → 2 digits, Base 1000 → 3 digits. This keeps the place values correct."
      },
      {
        "title": "What happens if the right side has fewer digits?",
        "answer": "We add zeros at the beginning. Example: 97² → difference = 3 → 3² = 9. Since base 100 needs 2 digits, write 09."
      },
      {
        "title": "What happens if the right side has extra digits?",
        "answer": "We carry the extra digit(s) to the left side. Example: 112² → 12² = 144. Keep 44 on the right and carry 1 to the left."
      },
      {
        "title": "How do we square numbers near 1000?",
        "answer": "The same method works. But since base 1000 has 3 zeros, the right side must contain exactly 3 digits."
      },
      {
        "title": "How do we find 1004²?",
        "answer": "Base = 1000. 1004 is +4 above 1000. Left part: 1004 + 4 = 1008. Right part: 4² = 016. Since base 1000 requires 3 digits, write 016. Final answer = 1008016."
      },
      {
        "title": "How do we find 996²?",
        "answer": "Base = 1000. 996 is -4 below 1000. Left part: 996 - 4 = 992. Right part: 4² = 016. Final answer = 992016."
      },
      {
        "title": "Can we use bases other than 10, 100, and 1000?",
        "answer": "Yes. We can also use bases like 50, 200, or 500. But these bases may need extra adjustment because they are not pure powers of 10."
      },
      {
        "title": "How do we find 48² using base 50?",
        "answer": "Base = 50. 48 is -2 from 50. Left part: 48 - 2 = 46. Right part: 2² = 4. Since base 50 is half of 100, multiply the left part by 50 and then add the right part. 46 × 50 = 2300. Add 4 → 2304. Final answer = 2304."
      },
      {
        "title": "What is the main benefit of squaring tricks?",
        "answer": "These tricks save time in mental calculations, competitive exams, aptitude tests, and fast arithmetic problems."
      }
    ],



    "squareroot": [
      {
        "title": "What is the fast square root trick?",
        "answer": "The fast square root trick helps us quickly find the square root of perfect square numbers without long division. We mainly use two ideas: the last digit of the number and the nearest perfect square range."
      },
      {
        "title": "What is a perfect square?",
        "answer": "A perfect square is a number obtained by multiplying a number by itself. Example: 4 = 2², 25 = 5², 81 = 9², 144 = 12²."
      },
      {
        "title": "What are the important squares we should memorize?",
        "answer": "You should memorize squares from 1² to 30² at minimum. Example: 10² = 100, 20² = 400, 30² = 900, 40² = 1600, 50² = 2500, 60² = 3600, 70² = 4900, 80² = 6400, 90² = 8100, 100² = 10000."
      },
      {
        "title": "How do we identify square roots quickly?",
        "answer": "Step 1: Look at the last digit of the number. Step 2: Find which numbers can give that last digit when squared. Step 3: Find the range using nearby perfect squares. Step 4: Choose the correct answer."
      },
      {
        "title": "Which last digits are possible in perfect squares?",
        "answer": "Perfect squares can only end with 0, 1, 4, 5, 6, or 9. They never end with 2, 3, 7, or 8."
      },
      {
        "title": "How do last digits help in finding square roots?",
        "answer": "The last digit of the square tells us the possible last digit(s) of the root. Example: If a square ends in 1, the root ends in 1 or 9. If a square ends in 4, the root ends in 2 or 8."
      },
      {
        "title": "What are the square root last digit patterns?",
        "answer": "1 → root ends with 1 or 9. 4 → root ends with 2 or 8. 5 → root ends with 5. 6 → root ends with 4 or 6. 9 → root ends with 3 or 7. 0 → root ends with 0."
      },
      {
        "title": "How do we use nearest square ranges?",
        "answer": "We check between which two perfect squares the number lies. This helps us find the first digit(s) of the square root."
      },
      {
        "title": "How do we find √2401?",
        "answer": "2401 ends with 01, so the root must end with 1 or 9. Now check nearest squares: 40² = 1600 and 50² = 2500. So the root is between 40 and 50. The only number between 40 and 50 ending with 1 or 9 is 49. Therefore, √2401 = 49."
      },
      {
        "title": "How do we find √3136?",
        "answer": "3136 ends with 6, so the root must end with 4 or 6. Now check nearest squares: 50² = 2500 and 60² = 3600. So the root is between 50 and 60. The possible numbers are 54 or 56. Since 56² = 3136, the answer is 56."
      },
      {
        "title": "How do we find √1024?",
        "answer": "1024 ends with 4, so the root must end with 2 or 8. Now check nearest squares: 30² = 900 and 40² = 1600. So the root lies between 30 and 40. Possible roots are 32 or 38. Since 32² = 1024, the answer is 32."
      },
      {
        "title": "How do we find √2025?",
        "answer": "2025 ends with 25, so the root must end with 5. Now check nearest squares: 40² = 1600 and 50² = 2500. So the root is between 40 and 50. The only number ending in 5 is 45. Therefore, √2025 = 45."
      },
      {
        "title": "How do we find √5776?",
        "answer": "5776 ends with 6, so the root must end with 4 or 6. Now check nearest squares: 70² = 4900 and 80² = 6400. So the root is between 70 and 80. Possible roots are 74 or 76. Since 76² = 5776, the answer is 76."
      },
      {
        "title": "How do we find √6561?",
        "answer": "6561 ends with 1, so the root must end with 1 or 9. Now check nearest squares: 80² = 6400 and 90² = 8100. So the root is between 80 and 90. Possible roots are 81 or 89. Since 81² = 6561, the answer is 81."
      },
      {
        "title": "Why do some last digits give two possible roots?",
        "answer": "Because different numbers can produce the same last digit when squared. Example: 2² = 4 and 8² = 64, both end in 4. So if a square ends in 4, the root may end in 2 or 8."
      },
      {
        "title": "How do we quickly reject wrong answers?",
        "answer": "First check the last digit rule. Then check the nearest square range. If both do not match, the answer is wrong."
      },
      {
        "title": "Can every number have an exact whole-number square root?",
        "answer": "No. Only perfect squares have exact whole-number square roots. Example: √49 = 7, but √50 is not a whole number."
      },
      {
        "title": "What is the fastest way to master square roots?",
        "answer": "Memorize squares from 1² to 30² or higher, practice last-digit patterns regularly, and solve many perfect square problems mentally."
      }
    ],



    "percentage": [
      {
        "title": "What is percentage change formula?",
        "answer": "Percentage change tells how much a value increases or decreases compared to its original value. The formula is: Percentage change = ((Final value - Initial value) / Initial value) × 100. It is used to measure growth or reduction in any quantity."
      },
      {
        "title": "What is the a-b theorem in percentage?",
        "answer": "The a-b theorem is a shortcut for finding net percentage change when two successive percentage changes happen. If a change is +a% and then +b% (or -b%), then Net change = a + b + (a×b)/100. This formula works for both increases and decreases."
      },
      {
        "title": "Why does the a-b theorem work?",
        "answer": "Because percentage changes are multiplicative, not just additive. When one change happens after another, the second change is applied on the new value, creating an extra term (a×b)/100."
      },
      {
        "title": "How do signs work in the a-b theorem?",
        "answer": "If a quantity increases, we take it as positive (+). If it decreases, we take it as negative (-). The same rule applies in the formula: Net change = a + b + (a×b)/100, where signs are included in a and b."
      },
      {
        "title": "What is net percentage increase when value increases by 10% twice?",
        "answer": "Using the a-b theorem: a = 10, b = 10. Net change = 10 + 10 + (10×10)/100 = 20 + 1 = 21% increase. This shows repeated increases create extra gain due to compounding."
      },
      {
        "title": "What is net change when value increases by 20% and decreases by 10%?",
        "answer": "Using the a-b theorem: a = +20, b = -10. Net change = 20 - 10 + (20×-10)/100 = 10 - 2 = 8% increase. The negative product reduces the final gain."
      },
      {
        "title": "What happens when both changes are negative?",
        "answer": "If both changes are decreases, the result can sometimes reduce loss due to the positive product term. Example: -10% and -10% gives -10 -10 + (100/100) = -19% overall decrease."
      },
      {
        "title": "What happens when one change is very large?",
        "answer": "The same formula works even for large values, but the interaction term (a×b)/100 becomes more significant and can strongly affect the final result."
      },
      {
        "title": "How do we apply percentage change step by step?",
        "answer": "Step 1: Identify first change (a%). Step 2: Identify second change (b%). Step 3: Apply signs (+ or -). Step 4: Use formula a + b + (ab/100). Step 5: Interpret result as increase or decrease."
      },
      {
        "title": "Why is percentage change not simply addition?",
        "answer": "Because each percentage change is applied on a new value, not the original one. This creates compounding effect, which makes simple addition incorrect."
      },
      {
        "title": "What is real-life use of percentage change?",
        "answer": "It is used in discounts, salary hikes, population growth, profit-loss calculations, and investment returns where values change multiple times."
      }
    ],



    "pass-fail": [
      {
        "title": "What are pass-fail questions in percentage?",
        "answer": "Pass-fail questions are percentage-based problems where we compare a student's scored marks with passing marks. These problems usually involve finding total marks, passing marks, or the difference between them using percentage logic."
      },
      {
        "title": "What is the basic approach to solve pass-fail questions?",
        "answer": "Step 1: Assume total marks as 100 if not given. Step 2: Convert pass percentage and obtained percentage into marks. Step 3: Find the difference between pass marks and obtained marks. Step 4: Use this difference to calculate total marks."
      },
      {
        "title": "Why do we assume total marks as 100?",
        "answer": "Because percentage is always based on 100. Assuming 100 simplifies calculations and helps convert percentages directly into marks without fractions."
      },
      {
        "title": "How do we solve pass-fail problems using difference method?",
        "answer": "We find the percentage difference between passing percentage and obtained percentage. Then we equate that difference in percentage to the given marks difference and calculate total marks."
      },
      {
        "title": "A student needs 35% to pass and gets 25%, failing by 40 marks. Find total marks.",
        "answer": "Pass percentage = 35%, obtained = 25%, so difference = 10%. This 10% equals 40 marks. So 100% = (40 ÷ 10) × 100 = 400 marks. Final answer: total marks = 400."
      },
      {
        "title": "If passing marks are 40% and student gets 30%, failing by 20 marks, find total marks.",
        "answer": "Difference = 10%. If 10% = 20 marks, then 100% = (20 ÷ 10) × 100 = 200 marks. Final answer: total marks = 200."
      },
      {
        "title": "What is the key idea behind pass-fail shortcut?",
        "answer": "The key idea is that percentage difference directly represents a fraction of total marks. We use this proportion to quickly find total marks without forming full equations."
      },
      {
        "title": "How do signs matter in pass-fail problems?",
        "answer": "If obtained marks are less than passing marks, it is failure (negative difference). If obtained marks are more, it indicates passing margin (positive difference)."
      },
      {
        "title": "What mistakes should be avoided in pass-fail questions?",
        "answer": "Do not mix up pass percentage and obtained percentage. Always calculate the difference correctly and ensure you convert percentage difference into actual marks properly."
      },
      {
        "title": "Where are pass-fail questions commonly used?",
        "answer": "They are commonly asked in aptitude tests, SSC, banking exams, and reasoning sections where quick percentage and ratio thinking is required."
      }
    ],



    "consumption": [
      {
        "title": "What is the concept of consumption in percentage problems?",
        "answer": "In consumption-based percentage questions, we study how quantity consumed changes when price changes while expenditure (total money spent) is assumed constant. If price increases, consumption decreases, and if price decreases, consumption increases."
      },
      {
        "title": "Why does consumption change when price changes?",
        "answer": "Because expenditure is fixed in most problems. Since Expenditure = Price × Consumption, if price goes up, consumption must go down to keep expenditure constant, and vice versa."
      },
      {
        "title": "What is the relationship between price and consumption?",
        "answer": "Price and consumption are inversely proportional when expenditure is constant. This means if price increases by x%, consumption decreases, and if price decreases by x%, consumption increases."
      },
      {
        "title": "What is formula for reduction in consumption?",
        "answer": "If price increases by x%, then reduction in consumption = (100x) / (100 + x)%. This formula comes from inverse proportionality between price and consumption."
      },
      {
        "title": "What is formula for increase in consumption?",
        "answer": "If price decreases by x%, then increase in consumption = (100x) / (100 - x)%. This helps find how much more quantity can be purchased when price drops."
      },
      {
        "title": "If price increases by 25%, how much does consumption reduce?",
        "answer": "Using formula: Reduction = (100 × 25) / (100 + 25) = 2500 / 125 = 20%. So consumption decreases by 20%."
      },
      {
        "title": "If price decreases by 20%, how much does consumption increase?",
        "answer": "Using formula: Increase = (100 × 20) / (100 - 20) = 2000 / 80 = 25%. So consumption increases by 25%."
      },
      {
        "title": "What is the key formula behind consumption problems?",
        "answer": "The main relationship is Price × Consumption = Constant (Expenditure). This is the foundation of all consumption-based percentage questions."
      },
      {
        "title": "Why is consumption inversely proportional to price?",
        "answer": "Because when expenditure is fixed, if price increases, fewer units can be bought, and if price decreases, more units can be bought, creating an inverse relationship."
      },
      {
        "title": "What mistakes should be avoided in consumption questions?",
        "answer": "Do not directly apply simple percentage change on consumption. Always use inverse proportion formulas because consumption does not change in the same direction as price."
      }
    ],


    "simple-intrest": [
      {
        "title": "What is Simple Interest (SI)?",
        "answer": "Simple Interest is the extra money earned or paid on a principal amount over time at a fixed rate. It is called 'simple' because interest is always calculated only on the original principal, not on accumulated interest."
      },
      {
        "title": "What is Simple Interest formula?",
        "answer": "Simple Interest = (P × R × T) / 100, where P is Principal, R is Rate of interest per year, and T is Time in years."
      },
      {
        "title": "What is amount in Simple Interest?",
        "answer": "Amount is the total money after interest is added. It is calculated as: Amount = Principal + Simple Interest."
      },
      {
        "title": "What do P, R, and T represent in SI?",
        "answer": "P = Principal (initial money invested or borrowed), R = Rate of interest (percentage per year), T = Time (duration in years)."
      },
      {
        "title": "Why is Simple Interest called linear interest?",
        "answer": "Because it increases in a straight-line manner over time. Interest grows uniformly since it is always calculated on the same principal amount."
      },
      {
        "title": "How do we solve SI step by step?",
        "answer": "Step 1: Identify P, R, and T. Step 2: Substitute into SI formula (P × R × T) / 100. Step 3: Calculate interest. Step 4: Add to principal if amount is required."
      },
      {
        "title": "Find SI on ₹500 at 5% for 1 year.",
        "answer": "Using formula SI = (P × R × T) / 100 = (500 × 5 × 1) / 100 = 25. So Simple Interest = ₹25."
      },
      {
        "title": "Find amount on ₹500 at 5% for 1 year.",
        "answer": "SI = ₹25. Amount = Principal + SI = 500 + 25 = ₹525."
      },
      {
        "title": "A sum doubles in 20 years at Simple Interest. Find rate.",
        "answer": "If sum doubles, interest = 100% of principal in 20 years. So rate per year = 100 / 20 = 5% per annum."
      },
      {
        "title": "A sum becomes four times in 30 years at Simple Interest. Find rate.",
        "answer": "Four times means total increase = 300% (since principal becomes 400%, interest is 300%). So rate per year = 300 / 30 = 10% per annum."
      },
      {
        "title": "Why do we convert doubling or tripling into percentage?",
        "answer": "Because Simple Interest is directly proportional to percentage growth. Converting into percentage makes it easy to find yearly rate using division over time."
      },
      {
        "title": "What is the shortcut idea behind SI problems?",
        "answer": "Instead of repeatedly using formula, we use the idea: Total Interest % = Rate × Time. This helps quickly find missing values."
      },
      {
        "title": "What are common mistakes in Simple Interest problems?",
        "answer": "Mixing up amount and interest, forgetting to convert time into years, and incorrectly handling percentage conversions for doubling or tripling cases."
      },
      {
        "title": "Where is Simple Interest used in real life?",
        "answer": "It is used in bank loans, fixed deposits (basic understanding), borrowing money, and exam aptitude questions where interest is calculated on a fixed principal."
      }
    ],



    "compound-intrest": [
      {
        "title": "What is Compound Interest (CI)?",
        "answer": "Compound Interest is the interest calculated on both the principal and the previously accumulated interest. This means every new interest calculation is done on an increased amount, not just the original principal."
      },
      {
        "title": "Why is Compound Interest more powerful than Simple Interest?",
        "answer": "Because in Compound Interest, interest itself earns interest over time. This leads to exponential growth, whereas Simple Interest grows linearly."
      },
      {
        "title": "What is the formula for Compound Interest amount?",
        "answer": "Amount A = P(1 + R/100)^n, where P is principal, R is rate of interest per year, and n is time in years."
      },
      {
        "title": "What is Compound Interest?",
        "answer": "Compound Interest = Amount - Principal = A - P."
      },
      {
        "title": "What is the difference between Simple Interest and Compound Interest?",
        "answer": "Simple Interest is calculated only on the original principal every time. Compound Interest is calculated on principal plus accumulated interest, making it higher than Simple Interest over time."
      },
      {
        "title": "How do we solve CI step by step?",
        "answer": "Step 1: Identify P, R, and n. Step 2: Apply formula A = P(1 + R/100)^n. Step 3: Calculate amount. Step 4: Subtract principal to get CI."
      },
      {
        "title": "Find amount on ₹1000 at 10% CI for 2 years.",
        "answer": "Using formula A = P(1 + R/100)^n = 1000(1.1)^2 = 1000 × 1.21 = ₹1210."
      },
      {
        "title": "Find Compound Interest on ₹1000 at 10% for 2 years.",
        "answer": "Amount = ₹1210. CI = Amount - Principal = 1210 - 1000 = ₹210."
      },
      {
        "title": "What is shortcut formula for 2-year Compound Interest?",
        "answer": "For 2 years: CI% = x + x + (x²/100), where x is the rate of interest per year."
      },
      {
        "title": "What is compound increase for 10% for 2 years?",
        "answer": "Using shortcut: 10 + 10 + (10×10)/100 = 20 + 1 = 21% increase. This shows compound growth effect."
      },
      {
        "title": "Why does CI grow faster than SI?",
        "answer": "Because each year the interest is added to the principal, increasing the base for next year's calculation, leading to exponential growth."
      },
      {
        "title": "What is compound interest effect in real life?",
        "answer": "It is used in bank savings, investments, loans, inflation, and population growth where values increase exponentially over time."
      },
      {
        "title": "What is the key idea behind compound interest problems?",
        "answer": "The key idea is 'interest on interest', meaning every period the base amount increases, so calculations must account for compounding rather than simple addition."
      },
      {
        "title": "What common mistakes should be avoided in CI?",
        "answer": "Students often forget to use exponent power for time, confuse SI with CI, or directly apply simple percentage addition instead of compound formula."
      }
    ],



"ratio":[
    {
      "title": "What is a ratio?",
      "answer": "A ratio compares two quantities using division. Example: 4:5 means 4 divided by 5."
    },
    {
      "title": "What does 3:7 mean?",
      "answer": "It means for every 3 units of first quantity, there are 7 units of second quantity."
    },
    {
      "title": "How to write ratio in fraction form?",
      "answer": "a:b can be written as a/b."
    },
    {
      "title": "What is inverse ratio?",
      "answer": "Inverse ratio means flipping the ratio. Example: 2:5 becomes 5:2."
    },
    {
      "title": "What is duplicate ratio?",
      "answer": "Duplicate ratio means squaring both terms. Example: 2:3 becomes 4:9."
    },
    {
      "title": "What is triplicate ratio?",
      "answer": "Triplicate ratio means cubing both terms. Example: 2:3 becomes 8:27."
    },
    {
      "title": "What is compound ratio?",
      "answer": "Compound ratio is obtained by multiplying corresponding terms. Example: 2:3 and 4:5 gives 8:15."
    },
    {
      "title": "What is proportion?",
      "answer": "When two ratios are equal, they are in proportion. Example: 2:4 = 3:6."
    },
    {
      "title": "What is continued proportion?",
      "answer": "If a:b = b:c, then a,b,c are in continued proportion."
    },
    {
      "title": "What is mean proportional?",
      "answer": "In a:b = b:c, b is called mean proportional."
    },
    {
      "title": "What is the formula of mean proportional?",
      "answer": "b² = ac"
    },
    {
      "title": "Find fourth proportional of 2, 4, 8.",
      "answer": "2:4 = 8:x => x = (4×8)/2 = 16."
    },
    {
      "title": "If a:b = 3:5 and b:c = 10:7, find a:b:c.",
      "answer": "LCM of b terms = 10. Multiply first ratio by 2 => 6:10. So ratio becomes 6:10:7."
    },
    {
      "title": "A sum is divided in ratio 2:3. If total is 100, find shares.",
      "answer": "Total parts = 5. First share = 40, second share = 60."
    },
    {
      "title": "What is direct proportion?",
      "answer": "When one quantity increases, the other also increases."
    },
    {
      "title": "What is inverse proportion?",
      "answer": "When one quantity increases, the other decreases."
    },
    {
      "title": "If 5 pens cost Rs 50, what is cost of 8 pens?",
      "answer": "1 pen = 10. So 8 pens = Rs 80."
    },
    {
      "title": "Find mean proportional between 9 and 16.",
      "answer": "√(9×16) = √144 = 12."
    },
    {
      "title": "Find third proportional to 4 and 8.",
      "answer": "4:8 = 8:x => x = 16."
    },
    {
      "title": "What is the golden rule of proportion?",
      "answer": "Product of extremes = Product of means."
    }
  ],

  "profit-and-loss":[
    {
      "title": "What is Cost Price?",
      "answer": "The price at which an item is bought."
    },
    {
      "title": "What is Selling Price?",
      "answer": "The price at which an item is sold."
    },
    {
      "title": "When do we get profit?",
      "answer": "When Selling Price is greater than Cost Price."
    },
    {
      "title": "When do we get loss?",
      "answer": "When Cost Price is greater than Selling Price."
    },
    {
      "title": "Formula of Profit",
      "answer": "Profit = SP - CP"
    },
    {
      "title": "Formula of Loss",
      "answer": "Loss = CP - SP"
    },
    {
      "title": "Formula of Profit Percentage",
      "answer": "Profit% = (Profit/CP) × 100"
    },
    {
      "title": "Formula of Loss Percentage",
      "answer": "Loss% = (Loss/CP) × 100"
    },
    {
      "title": "An item bought for Rs 1000 is sold for Rs 1200. Find profit.",
      "answer": "Profit = 1200 - 1000 = Rs 200."
    },
    {
      "title": "Find profit percentage if CP = 500 and SP = 650.",
      "answer": "Profit = 150. Profit% = (150/500)×100 = 30%."
    },
    {
      "title": "Find loss percentage if CP = 800 and SP = 720.",
      "answer": "Loss = 80. Loss% = (80/800)×100 = 10%."
    },
    {
      "title": "A shopkeeper sells an article at 25% profit. If CP is 400, find SP.",
      "answer": "SP = 400 + 25% of 400 = 500."
    },
    {
      "title": "An article is sold at 20% loss for Rs 800. Find CP.",
      "answer": "80% of CP = 800. CP = 1000."
    },
    {
      "title": "Find SP if CP is 1000 and profit is 15%.",
      "answer": "SP = 1000 + 150 = 1150."
    },
    {
      "title": "Find CP if SP is 900 and loss is 10%.",
      "answer": "90% of CP = 900 => CP = 1000."
    },
    {
      "title": "A seller gains Rs 50 on selling an item for Rs 450. Find CP.",
      "answer": "CP = 450 - 50 = 400."
    },
    {
      "title": "If an item is sold at double the CP, find profit percentage.",
      "answer": "Profit = 100%."
    },
    {
      "title": "If SP = CP, what is profit or loss?",
      "answer": "No profit and no loss."
    },
    {
      "title": "A shopkeeper buys 10 apples for Rs 100 and sells each for Rs 15. Find profit.",
      "answer": "CP = 100, SP = 150, Profit = 50."
    },
    {
      "title": "Why is CP used in denominator in profit percentage?",
      "answer": "Because profit and loss are always calculated on cost price."
    }
  ],



  "discount": [
  {
    "title": "What is Marked Price?",
    "answer": "The price written on the tag of the product."
  },
  {
    "title": "What is Discount?",
    "answer": "Reduction given on Marked Price."
  },
  {
    "title": "Formula of Discount",
    "answer": "Discount = MP - SP"
  },
  {
    "title": "Formula of Discount Percentage",
    "answer": "Discount% = (Discount/MP) × 100"
  },
  {
    "title": "A shirt marked Rs 2000 is sold for Rs 1600. Find discount.",
    "answer": "Discount = 2000 - 1600 = Rs 400."
  },
  {
    "title": "Find discount percentage if MP = 5000 and SP = 4000.",
    "answer": "Discount = 1000. Discount% = 20%."
  },
  {
    "title": "A 10% discount is given on Rs 800. Find selling price.",
    "answer": "Discount = 80. SP = 720."
  },
  {
    "title": "Successive discounts of 20% and 10% are given on Rs 2000. Find final price.",
    "answer": "After 20% discount => 1600. After 10% discount => 1440."
  },
  {
    "title": "What is the shortcut formula for successive discount?",
    "answer": "Net discount = a + b - (ab/100)"
  },
  {
    "title": "Find net discount of 20% and 10%.",
    "answer": "20 + 10 - (20×10)/100 = 28%."
  },
  {
    "title": "A product gets two discounts 30% and 20%. Find equivalent discount.",
    "answer": "30 + 20 - 6 = 44%."
  },
  {
    "title": "Why are successive discounts not simply added?",
    "answer": "Because second discount is applied on reduced price."
  },
  {
    "title": "A product marked Rs 1000 is sold at 25% discount. Find SP.",
    "answer": "SP = 750."
  },
  {
    "title": "If MP is Rs 500 and discount is Rs 50, find discount percentage.",
    "answer": "Discount% = (50/500)×100 = 10%."
  },
  {
    "title": "A product sold for Rs 900 after 10% discount. Find MP.",
    "answer": "90% of MP = 900 => MP = 1000."
  }
],




"average": [
    {
      "title": "What is average?",
      "answer": "Average is sum of observations divided by total number of observations."
    },
    {
      "title": "Formula of average",
      "answer": "Average = Sum of observations / Number of observations"
    },
    {
      "title": "Find average of 2, 4, 6, 8.",
      "answer": "Sum = 20, total numbers = 4, average = 5."
    },
    {
      "title": "If average of 5 numbers is 10, find total sum.",
      "answer": "Sum = 5 × 10 = 50."
    },
    {
      "title": "Average of 8 students is 42. If teacher joins, average becomes 44. Find teacher age.",
      "answer": "Old sum = 336. New sum = 396. Teacher age = 60."
    },
    {
      "title": "If one number increases by 5, how does average change for 5 numbers?",
      "answer": "Average increases by 1."
    },
    {
      "title": "Average of 10 numbers is 15. One number removed is 25. Find new average.",
      "answer": "Total = 150. Remaining sum = 125. New average = 125/9."
    },
    {
      "title": "Average speed formula",
      "answer": "Average Speed = Total Distance / Total Time"
    },
    {
      "title": "Average of consecutive numbers 1 to 9.",
      "answer": "Average = (first + last)/2 = 5."
    },
    {
      "title": "Average of first 20 natural numbers.",
      "answer": "Average = (1 + 20)/2 = 10.5."
    }
  ],



  "cyclicity":[
    {
      "title": "What is unit digit?",
      "answer": "The last digit of a number."
    },
    {
      "title": "What is cyclicity?",
      "answer": "Repeating pattern of unit digits in powers."
    },
    {
      "title": "Find unit digit of 2^1, 2^2, 2^3, 2^4.",
      "answer": "2, 4, 8, 6"
    },
    {
      "title": "What is cyclicity of 2?",
      "answer": "4 because pattern repeats after 4 powers."
    },
    {
      "title": "Find unit digit of 2^78.",
      "answer": "78 mod 4 = 2. Second digit in cycle 2,4,8,6 is 4."
    },
    {
      "title": "Find unit digit of 3^123.",
      "answer": "123 mod 4 = 3. Third digit in cycle 3,9,7,1 is 7."
    },
    {
      "title": "What is cyclicity of 5?",
      "answer": "1 because every power ends with 5."
    },
    {
      "title": "What is cyclicity of 6?",
      "answer": "1 because every power ends with 6."
    },
    {
      "title": "Find unit digit of 7^45.",
      "answer": "Cycle: 7,9,3,1. 45 mod 4 = 1. Answer = 7."
    },
    {
      "title": "Find unit digit of 9^12.",
      "answer": "Cycle: 9,1. 12 mod 2 = 0. Answer = 1."
    },
    {
      "title": "Why do we divide exponent by cyclicity?",
      "answer": "To locate correct repeating unit digit."
    },
    {
      "title": "If remainder becomes 0 while dividing exponent by cyclicity, what happens?",
      "answer": "Take the last digit in cycle."
    },
    {
      "title": "Find unit digit of 12^15.",
      "answer": "Only check 2^15. Cycle 2,4,8,6. 15 mod 4 = 3. Answer = 8."
    },
    {
      "title": "Find unit digit of 17^20.",
      "answer": "Check 7^20. 20 mod 4 = 0. Last digit in cycle 7,9,3,1 is 1."
    },
    {
      "title": "Find unit digit of 8^32.",
      "answer": "Cycle: 8,4,2,6. 32 mod 4 = 0. Answer = 6."
    },
    {
      "title": "Find unit digit of 4^9.",
      "answer": "Cycle: 4,6. 9 mod 2 = 1. Answer = 4."
    },
    {
      "title": "Find unit digit of 6^999.",
      "answer": "Always 6."
    },
    {
      "title": "Find unit digit of 5^888.",
      "answer": "Always 5."
    }
  ],

"number-series": [
  {
    "title": "What is a number series?",
    "answer": "A sequence of numbers following a specific pattern."
  },
  {
    "title": "What are common operations in number series?",
    "answer": "Addition, subtraction, multiplication, division, squares, cubes and alternating patterns."
  },
  {
    "title": "Find next number: 1, 6, 18, 36",
    "answer": "Pattern is ×1, ×2, ×3. Next = 36×4 = 144."
  },
  {
    "title": "Find next number: 15, 16, 18, 21",
    "answer": "Differences are +1, +2, +3. Next = 25."
  },
  {
    "title": "Find next number: 51, 47, 43, 39",
    "answer": "Pattern is -4. Next = 35."
  },
  {
    "title": "Find next number: 4, 8, 9, 12, 14",
    "answer": "Two patterns: +4, +3, +3, +2, +5, +1. Next = 16."
  },
  {
    "title": "What is difference series?",
    "answer": "A series solved by checking differences between terms."
  },
  {
    "title": "What is alternate series?",
    "answer": "A series having two different patterns alternatively."
  },
  {
    "title": "Find missing number: 384, 341, 392, 477, 596",
    "answer": "Pattern: +17, +51, +85, +119. Missing number = 511."
  },
  {
    "title": "What is multiplication pattern?",
    "answer": "A series where terms are multiplied by numbers."
  },
  {
    "title": "Find next term: 2, 6, 18, 54",
    "answer": "Each term multiplied by 3. Next = 162."
  },
  {
    "title": "Find next term: 5, 10, 17, 26",
    "answer": "Differences are +5, +7, +9. Next difference = +11. Next term = 37."
  },
  {
    "title": "Find missing term: 3, 7, 15, 31, ?",
    "answer": "Pattern = ×2 +1. Next = 63."
  },
  {
    "title": "Find next number: 2, 4, 16, 256",
    "answer": "Each term squared. Next = 65536."
  },
  {
    "title": "Find next number: 1, 1, 2, 3, 5, 8",
    "answer": "Fibonacci series. Next = 13."
  }
],



"letter-series": [
    {
      "title": "What is a letter series?",
      "answer": "A sequence of letters following alphabetical patterns."
    },
    {
      "title": "What is alphabetical position of A?",
      "answer": "A = 1."
    },
    {
      "title": "What is alphabetical position of Z?",
      "answer": "Z = 26."
    },
    {
      "title": "Find next letter: A, C, E, G",
      "answer": "Skipping one letter each time. Next = I."
    },
    {
      "title": "Find next letter: B, E, H, K",
      "answer": "Pattern +3. Next = N."
    },
    {
      "title": "Find next letters: P, M, J, G",
      "answer": "Pattern -3. Next = D."
    },
    {
      "title": "Find next term: A, D, H, M",
      "answer": "Pattern +3, +4, +5. Next = S."
    },
    {
      "title": "Find opposite letter of A.",
      "answer": "Z."
    },
    {
      "title": "Find opposite letter of B.",
      "answer": "Y."
    },
    {
      "title": "What is reverse alphabetical order?",
      "answer": "Z to A."
    },
    {
      "title": "Find next term: AZ, BY, CX",
      "answer": "Next = DW."
    },
    {
      "title": "Find missing term: A, C, F, J, ?",
      "answer": "Pattern +2, +3, +4. Next = O."
    },
    {
      "title": "What is position of M?",
      "answer": "13."
    },
    {
      "title": "What is position of T?",
      "answer": "20."
    },
    {
      "title": "Find next letter pair: AB, DE, GH",
      "answer": "Next = JK."
    }
  ],



"coding-decoding": [
  {
    "title": "What is coding-decoding?",
    "answer": "A reasoning topic where words or letters are coded using patterns."
  },
  {
    "title": "What is alphabet coding?",
    "answer": "Coding based on alphabetical positions."
  },
  {
    "title": "If A = 1, B = 2, what is CAT?",
    "answer": "C=3, A=1, T=20 => 3+1+20 = 24."
  },
  {
    "title": "If each letter shifts by +1, code for CAT?",
    "answer": "DBU."
  },
  {
    "title": "If each letter shifts by +2, code for DOG?",
    "answer": "FQI."
  },
  {
    "title": "What is reverse coding?",
    "answer": "Coding using opposite letters. Example: A=Z, B=Y."
  },
  {
    "title": "If APPLE is coded as BQQMF, what is BALL?",
    "answer": "CBMM."
  },
  {
    "title": "What is alpha-numeric coding?",
    "answer": "Coding using both numbers and letters."
  },
  {
    "title": "If PEN = 16+5+14, find total.",
    "answer": "35."
  },
  {
    "title": "If BAT = 2-1-20, what is total?",
    "answer": "23."
  },
  {
    "title": "If COME = DPNF, what rule is used?",
    "answer": "Each letter shifted by +1."
  },
  {
    "title": "If SKY = TLB, what is code pattern?",
    "answer": "Each letter shifted by +1 cyclically."
  },
  {
    "title": "What is cyclic coding?",
    "answer": "Coding where Z shifts to A."
  },
  {
    "title": "If CUP = DVQ, decode DVQ.",
    "answer": "CUP."
  },
  {
    "title": "Why is alphabetical position important in coding?",
    "answer": "Because most coding questions use letter positions."
  }
],



"directions": [
    {
      "title": "What are the four main directions?",
      "answer": "North, South, East and West."
    },
    {
      "title": "Which direction is opposite to North?",
      "answer": "South."
    },
    {
      "title": "Which direction is opposite to East?",
      "answer": "West."
    },
    {
      "title": "If a person faces North and turns right, which direction will he face?",
      "answer": "East."
    },
    {
      "title": "If a person faces South and turns left, which direction will he face?",
      "answer": "East."
    },
    {
      "title": "How many degrees are in a full turn?",
      "answer": "360 degrees."
    },
    {
      "title": "How many degrees are in a right turn?",
      "answer": "90 degrees."
    },
    {
      "title": "How many degrees are in a left turn?",
      "answer": "90 degrees."
    },
    {
      "title": "How many degrees are in half turn?",
      "answer": "180 degrees."
    },
    {
      "title": "If facing East and turning left twice, final direction?",
      "answer": "West."
    },
    {
      "title": "If facing North and turning right three times, final direction?",
      "answer": "West."
    },
    {
      "title": "What direction is between North and East?",
      "answer": "North-East."
    },
    {
      "title": "What direction is between South and West?",
      "answer": "South-West."
    },
    {
      "title": "What is clockwise direction?",
      "answer": "Movement like clock hands."
    },
    {
      "title": "What is anti-clockwise direction?",
      "answer": "Movement opposite to clock hands."
    }
  ],




"syllogism": [
  {
    "title": "What is syllogism?",
    "answer": "A reasoning topic based on logical statements and conclusions."
  },
  {
    "title": "What is a universal statement?",
    "answer": "A statement using all or no."
  },
  {
    "title": "What is a particular statement?",
    "answer": "A statement using some."
  },
  {
    "title": "What does 'All cats are animals' mean?",
    "answer": "Every cat belongs to animal group."
  },
  {
    "title": "If all apples are fruits and all fruits are healthy, are all apples healthy?",
    "answer": "Yes."
  },
  {
    "title": "If some boys are tall and all tall are athletes, are some boys athletes?",
    "answer": "Yes."
  },
  {
    "title": "If no dogs are cats, can any dog be cat?",
    "answer": "No."
  },
  {
    "title": "What is Venn diagram in syllogism?",
    "answer": "A diagram used to represent logical relations."
  },
  {
    "title": "If all A are B and all B are C, then relation between A and C?",
    "answer": "All A are C."
  },
  {
    "title": "If some A are B and some B are C, can we conclude some A are C?",
    "answer": "No definite conclusion."
  },
  {
    "title": "What does 'No A is B' mean?",
    "answer": "A and B have no common element."
  },
  {
    "title": "What does 'Some A are B' mean?",
    "answer": "At least one A belongs to B."
  },
  {
    "title": "Can two negative conclusions exist together?",
    "answer": "No."
  },
  {
    "title": "Can a conclusion be stronger than statement?",
    "answer": "No."
  },
  {
    "title": "Why are Venn diagrams useful?",
    "answer": "They make logical relations easy to visualize."
  }
],



"calendar": [
    {
      "title": "How many days are in an ordinary year?",
      "answer": "365 days."
    },
    {
      "title": "How many days are in a leap year?",
      "answer": "366 days."
    },
    {
      "title": "How many odd days are in an ordinary year?",
      "answer": "1 odd day."
    },
    {
      "title": "How many odd days are in a leap year?",
      "answer": "2 odd days."
    },
    {
      "title": "What is a leap year?",
      "answer": "A year divisible by 4."
    },
    {
      "title": "What is century leap year rule?",
      "answer": "Century year must be divisible by 400."
    },
    {
      "title": "Is 1900 a leap year?",
      "answer": "No, because not divisible by 400."
    },
    {
      "title": "Is 2000 a leap year?",
      "answer": "Yes, because divisible by 400."
    },
    {
      "title": "How many odd days are in 52 weeks?",
      "answer": "0 odd days."
    },
    {
      "title": "What day comes after Tuesday?",
      "answer": "Wednesday."
    },
    {
      "title": "What day was on 1 Jan 2023?",
      "answer": "Sunday."
    },
    {
      "title": "If today is Monday, what day after 10 days?",
      "answer": "Thursday."
    },
    {
      "title": "What is odd day?",
      "answer": "Remaining days after complete weeks."
    },
    {
      "title": "Why are odd days important?",
      "answer": "They help determine day of week."
    },
    {
      "title": "How many odd days in 100 years?",
      "answer": "5 odd days."
    }
  ],



"cubes-and-dice": [
  {
    "title": "How many faces does a cube have?",
    "answer": "6 faces."
  },
  {
    "title": "How many edges does a cube have?",
    "answer": "12 edges."
  },
  {
    "title": "How many vertices does a cube have?",
    "answer": "8 vertices."
  },
  {
    "title": "How many opposite faces are in cube?",
    "answer": "3 pairs."
  },
  {
    "title": "How many adjacent faces can one face have?",
    "answer": "4 adjacent faces."
  },
  {
    "title": "Can opposite faces touch each other?",
    "answer": "No."
  },
  {
    "title": "What is dice?",
    "answer": "A cube with numbers marked on faces."
  },
  {
    "title": "What is standard dice rule?",
    "answer": "Opposite faces sum to 7."
  },
  {
    "title": "Which face is opposite to 1 in standard dice?",
    "answer": "6."
  },
  {
    "title": "Which face is opposite to 2 in standard dice?",
    "answer": "5."
  },
  {
    "title": "Which face is opposite to 3 in standard dice?",
    "answer": "4."
  },
  {
    "title": "How many dimensions does a cube have?",
    "answer": "3 dimensions."
  },
  {
    "title": "Can two opposite faces be visible together?",
    "answer": "No."
  },
  {
    "title": "How many faces are visible in a normal cube view?",
    "answer": "3 faces."
  },
  {
    "title": "What is cube net?",
    "answer": "A 2D unfolded shape of cube."
  }
],



"games-and-tournament": [
    {
      "title": "What is knockout tournament?",
      "answer": "A tournament where losing team gets eliminated."
    },
    {
      "title": "Formula for number of matches in knockout tournament",
      "answer": "Matches = n - 1"
    },
    {
      "title": "How many matches in knockout with 8 teams?",
      "answer": "7 matches."
    },
    {
      "title": "How many matches in knockout with 16 teams?",
      "answer": "15 matches."
    },
    {
      "title": "What is round robin tournament?",
      "answer": "Every team plays with every other team."
    },
    {
      "title": "Formula of round robin matches",
      "answer": "n(n-1)/2"
    },
    {
      "title": "How many matches in round robin with 5 teams?",
      "answer": "10 matches."
    },
    {
      "title": "How many matches in round robin with 10 teams?",
      "answer": "45 matches."
    },
    {
      "title": "Why does knockout have fewer matches?",
      "answer": "Because teams get eliminated."
    },
    {
      "title": "Which tournament is longer: knockout or round robin?",
      "answer": "Round robin."
    },
    {
      "title": "In knockout tournament with 32 teams, matches?",
      "answer": "31 matches."
    },
    {
      "title": "In round robin tournament with 6 teams, matches?",
      "answer": "15 matches."
    },
    {
      "title": "What is semifinal?",
      "answer": "Round before final."
    },
    {
      "title": "What is final match?",
      "answer": "Last match deciding winner."
    },
    {
      "title": "What is bye in knockout tournament?",
      "answer": "A team directly enters next round without playing."
    }
  ],




};

export default questionsData;