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
        "answer": "Pass-fail questions are percentage-based aptitude problems where we compare obtained marks with passing marks. Usually we are asked to find total marks, passing marks, obtained marks, or passing/failing margin."
      },
      {
        "title": "What is the core idea behind pass-fail questions?",
        "answer": "The main idea is that the difference in percentage represents the actual difference in marks. Once we match percentage difference with mark difference, we can easily calculate total marks."
      },
      {
        "title": "What is the standard approach to solve pass-fail problems?",
        "answer": "Step 1: Identify pass percentage and obtained percentage. Step 2: Find percentage difference. Step 3: Match this percentage difference with actual mark difference. Step 4: Calculate total marks using proportion."
      },
      {
        "title": "Why do we compare percentage difference?",
        "answer": "Because the difference between pass marks and obtained marks always represents a fixed percentage of total marks. This helps us directly calculate the total."
      },
      {
        "title": "How do we solve: A student needs 35% to pass and gets 25%, failing by 40 marks?",
        "answer": "Step 1: Passing percentage = 35%. Obtained percentage = 25%. Step 2: Difference = 35 - 25 = 10%. Step 3: This 10% corresponds to 40 marks. Step 4: Therefore 1% = 40 ÷ 10 = 4 marks. Step 5: 100% = 4 × 100 = 400 marks. Final Answer = 400 marks."
      },
      {
        "title": "Shortcut method for: A student needs 35% to pass and gets 25%, failing by 40 marks.",
        "answer": "Difference = 10%. If 10% = 40 marks, then 100% = (40 × 100) ÷ 10 = 400 marks."
      },
      {
        "title": "How do we solve: Passing marks are 40% and a student gets 30%, failing by 20 marks?",
        "answer": "Step 1: Pass percentage = 40%. Obtained percentage = 30%. Step 2: Difference = 10%. Step 3: 10% corresponds to 20 marks. Step 4: Therefore 1% = 2 marks. Step 5: 100% = 2 × 100 = 200 marks. Final Answer = 200 marks."
      },
      {
        "title": "Shortcut method for: Passing marks are 40% and student gets 30%, failing by 20 marks.",
        "answer": "Difference = 10%. If 10% = 20 marks, then total marks = (20 × 100) ÷ 10 = 200 marks."
      },
      {
        "title": "How do we solve questions when student passes instead of fails?",
        "answer": "If obtained percentage is more than passing percentage, then the extra percentage represents passing margin."
      },
      {
        "title": "Solve: Passing marks are 45%. A student gets 55% and passes by 50 marks.",
        "answer": "Step 1: Obtained percentage = 55%, passing percentage = 45%. Step 2: Difference = 10%. Step 3: This 10% equals 50 marks. Step 4: 1% = 50 ÷ 10 = 5 marks. Step 5: 100% = 5 × 100 = 500 marks. Final Answer = 500 marks."
      },
      {
        "title": "Shortcut for: Passing marks are 45%. Student gets 55% and passes by 50 marks.",
        "answer": "Difference = 10%. If 10% = 50 marks, then 100% = (50 × 100) ÷ 10 = 500 marks."
      },
      {
        "title": "How do we find passing marks after finding total marks?",
        "answer": "Multiply total marks by passing percentage. Example: If total marks = 400 and passing percentage = 35%, then passing marks = (35 × 400) ÷ 100 = 140 marks."
      },
      {
        "title": "How do we find obtained marks?",
        "answer": "Multiply total marks by obtained percentage. Example: If total marks = 400 and obtained percentage = 25%, then obtained marks = (25 × 400) ÷ 100 = 100 marks."
      },
      {
        "title": "Complete verification of first example.",
        "answer": "Total marks = 400. Passing marks = 35% of 400 = 140. Obtained marks = 25% of 400 = 100. Difference = 140 - 100 = 40 marks. Hence answer is correct."
      },
      {
        "title": "What is the fastest shortcut for pass-fail problems?",
        "answer": "Total Marks = (Difference in marks × 100) ÷ Difference in percentage."
      },
      {
        "title": "Important shortcut formula for pass-fail questions.",
        "answer": "Total Marks = (Actual Difference × 100) / Percentage Difference."
      },
      {
        "title": "How do we identify percentage difference correctly?",
        "answer": "Always subtract smaller percentage from larger percentage. Example: 45% and 30% → difference = 15%."
      },
      {
        "title": "What common mistakes should be avoided?",
        "answer": "Do not confuse obtained percentage with passing percentage. Do not directly subtract marks from percentages. Always compare percentage difference first."
      },
      {
        "title": "Why are pass-fail questions considered easy aptitude questions?",
        "answer": "Because most questions can be solved using a single shortcut formula without lengthy equations once percentage difference is understood properly."
      },
      {
        "title": "What is the most important concept to remember in pass-fail questions?",
        "answer": "Percentage difference always represents the actual difference in marks. This single concept solves almost every pass-fail aptitude problem quickly."
      }
    ],



    "consumption": [
      {
        "title": "What is the basic concept of consumption problems?",
        "answer": "Consumption problems are based on the idea that total expenditure remains constant. If price increases, consumption must decrease. If price decreases, consumption must increase. The main relationship is: Price × Consumption = Constant."
      },
      {
        "title": "Why are price and consumption inversely proportional?",
        "answer": "Because money spent remains fixed. If one item becomes more expensive, fewer items can be purchased. If the item becomes cheaper, more quantity can be purchased."
      },
      {
        "title": "What is the most important formula in consumption problems?",
        "answer": "Price × Consumption = Constant Expenditure. This single formula is the foundation of the entire topic."
      },
      {
        "title": "What happens when price increases?",
        "answer": "When price increases, consumption decreases so that expenditure remains unchanged."
      },
      {
        "title": "What happens when price decreases?",
        "answer": "When price decreases, consumption increases because the same money can buy more quantity."
      },
      {
        "title": "What is the formula for reduction in consumption?",
        "answer": "If price increases by x%, then reduction in consumption = (100x) / (100 + x)%."
      },
      {
        "title": "What is the formula for increase in consumption?",
        "answer": "If price decreases by x%, then increase in consumption = (100x) / (100 - x)%."
      },
      {
        "title": "Why do we not directly use same percentage for consumption?",
        "answer": "Because consumption changes inversely with price, not directly. A 20% increase in price does not mean 20% decrease in consumption."
      },
      {
        "title": "How do we solve: Price increases by 25%. Find reduction in consumption.",
        "answer": "Step 1: Price increase = 25%. Step 2: Use formula Reduction = (100 × x) / (100 + x). Step 3: Substitute x = 25. Reduction = (100 × 25) / (100 + 25) = 2500 / 125 = 20%. Final Answer = Consumption must reduce by 20%."
      },
      {
        "title": "Shortcut method for: Price increases by 25%.",
        "answer": "Reduction = (100 × 25) / 125 = 20%."
      },
      {
        "title": "Complete conceptual explanation of 25% increase example.",
        "answer": "Suppose initially price = ₹100 per kg and expenditure = ₹1000. Consumption = 1000 ÷ 100 = 10 kg. After 25% increase, new price = ₹125 per kg. New consumption = 1000 ÷ 125 = 8 kg. Reduction = 10 - 8 = 2 kg. Percentage reduction = (2/10) × 100 = 20%."
      },
      {
        "title": "How do we solve: Price decreases by 20%. Find increase in consumption.",
        "answer": "Step 1: Price decrease = 20%. Step 2: Use formula Increase = (100 × x) / (100 - x). Step 3: Substitute x = 20. Increase = (100 × 20) / (100 - 20) = 2000 / 80 = 25%. Final Answer = Consumption increases by 25%."
      },
      {
        "title": "Shortcut method for: Price decreases by 20%.",
        "answer": "Increase = (100 × 20) / 80 = 25%."
      },
      {
        "title": "Complete conceptual explanation of 20% decrease example.",
        "answer": "Suppose initial price = ₹100 per kg and expenditure = ₹1000. Consumption = 10 kg. After 20% decrease, new price = ₹80 per kg. New consumption = 1000 ÷ 80 = 12.5 kg. Increase = 12.5 - 10 = 2.5 kg. Percentage increase = (2.5/10) × 100 = 25%."
      },
      {
        "title": "How do we solve: Price increases by 40%. Find reduction in consumption.",
        "answer": "Step 1: Use reduction formula. Step 2: Reduction = (100 × 40) / (100 + 40) = 4000 / 140 = 28.57%. Final Answer = Consumption reduces by 28.57%."
      },
      {
        "title": "Shortcut for: Price increases by 40%.",
        "answer": "Reduction = 4000 / 140 = 28.57%."
      },
      {
        "title": "How do we solve: Price decreases by 50%. Find increase in consumption.",
        "answer": "Step 1: Use increase formula. Step 2: Increase = (100 × 50) / (100 - 50) = 5000 / 50 = 100%. Final Answer = Consumption doubles."
      },
      {
        "title": "Why does 50% decrease in price double consumption?",
        "answer": "Suppose price changes from ₹100 to ₹50 while expenditure remains same. Earlier ₹1000 bought 10 units. Now ₹1000 buys 20 units. Hence consumption becomes double, meaning 100% increase."
      },
      {
        "title": "What is the fastest shortcut formula for consumption problems?",
        "answer": "If price increases by x%, use Reduction = (100x)/(100+x). If price decreases by x%, use Increase = (100x)/(100-x)."
      },
      {
        "title": "What common mistakes should be avoided?",
        "answer": "Do not directly subtract percentages. Always remember price and consumption are inversely proportional. Use the proper formulas instead of guessing."
      },
      {
        "title": "What is the biggest concept to remember in consumption problems?",
        "answer": "Expenditure always remains constant. Because of this, price and consumption always move in opposite directions."
      }
    ],


    "simple-intrest": [
      {
        "title": "What is Simple Interest?",
        "answer": "Simple Interest (SI) is the extra money earned or paid only on the original principal amount. Interest does not get added back to the principal. Because of this, interest increases uniformly every year."
      },
      {
        "title": "Why is it called Simple Interest?",
        "answer": "Because interest is always calculated only on the original principal amount, not on previously earned interest. So growth remains simple and linear."
      },
      {
        "title": "What is the most important SI formula?",
        "answer": "Simple Interest (SI) = (P × R × T) / 100"
      },
      {
        "title": "What is the formula for Amount?",
        "answer": "Amount = Principal + Simple Interest = P + SI"
      },
      {
        "title": "What do P, R, and T mean?",
        "answer": "P = Principal (original money), R = Rate of interest per year, T = Time in years."
      },
      {
        "title": "What is the basic logic behind Simple Interest?",
        "answer": "Interest earned every year remains same because the principal never changes. Example: If ₹1000 earns 10% SI, then every year interest will be ₹100 only."
      },
      {
        "title": "How do we solve Simple Interest problems step by step?",
        "answer": "Step 1: Identify Principal (P), Rate (R), and Time (T). Step 2: Substitute into SI formula. Step 3: Calculate SI. Step 4: Add SI to Principal if Amount is asked."
      },
      {
        "title": "Solve: Find SI on ₹500 at 5% for 1 year.",
        "answer": "Step 1: P = 500, R = 5%, T = 1 year. Step 2: Apply formula.  Step 3: SI = 25. Final Answer = ₹25."
      },
      {
        "title": "Shortcut method for: Find SI on ₹500 at 5% for 1 year.",
        "answer": "5% of 500 = 25. Since time is 1 year, SI = ₹25 directly."
      },
      {
        "title": "Solve: Find Amount on ₹500 at 5% for 1 year.",
        "answer": "Step 1: SI = ₹25. Step 2: Amount = Principal + SI = 500 + 25 = ₹525. Final Answer = ₹525."
      },
      {
        "title": "Complete conceptual explanation of first example.",
        "answer": "5% means ₹5 interest on every ₹100 for 1 year. So on ₹500, interest = ₹25. Since SI does not change yearly, interest remains fixed."
      },
      {
        "title": "Solve: Find SI on ₹2000 at 10% for 3 years.",
        "answer": "Step 1: P = 2000, R = 10%, T = 3 years. Step 2: Apply formula.  Step 3: SI = 600. Final Answer = ₹600."
      },
      {
        "title": "Shortcut method for: ₹2000 at 10% for 3 years.",
        "answer": "10% of 2000 = ₹200 per year. For 3 years: 200 × 3 = ₹600."
      },
      {
        "title": "How do we solve doubling questions in SI?",
        "answer": "When a sum doubles, interest becomes equal to principal. That means total interest earned = 100% of principal."
      },
      {
        "title": "Solve: A sum doubles in 20 years at SI. Find rate.",
        "answer": "Step 1: Doubling means interest = 100% of principal. Step 2: Time = 20 years. Step 3: Rate per year = 100 ÷ 20 = 5%. Final Answer = 5% per annum."
      },
      {
        "title": "Shortcut for doubling question.",
        "answer": "If money doubles in T years under SI, then Rate = 100/T."
      },
      {
        "title": "Solve: A sum becomes three times in 20 years at SI.",
        "answer": "Three times means final amount = 300% of principal. Therefore interest = 200%. Time = 20 years. Rate = 200 ÷ 20 = 10%. Final Answer = 10%."
      },
      {
        "title": "Solve: A sum becomes four times in 30 years at SI.",
        "answer": "Step 1: Four times means amount = 400% of principal. Step 2: Interest = 400% - 100% = 300%. Step 3: Time = 30 years. Step 4: Rate = 300 ÷ 30 = 10%. Final Answer = 10% per annum."
      },
      {
        "title": "Shortcut for multiplication questions in SI.",
        "answer": "If amount becomes n times in T years, then Rate = ((n-1) × 100) / T."
      },
      {
        "title": "How do we solve reverse SI questions?",
        "answer": "Use formula transformations. Example: If SI, Rate, and Time are given, then Principal = (SI × 100)/(R × T)."
      },
      {
        "title": "Solve: SI is ₹240, Rate = 8%, Time = 3 years. Find Principal.",
        "answer": "Step 1: Use reverse formula.  Step 2: Substitute values. Principal = (240 × 100)/(8 × 3) = 24000/24 = ₹1000. Final Answer = ₹1000."
      },
      {
        "title": "Shortcut for reverse SI problems.",
        "answer": "Principal = (SI × 100)/(Rate × Time)."
      },
      {
        "title": "Why is SI called linear growth?",
        "answer": "Because equal interest is added every year. Growth happens in a straight-line pattern instead of increasing faster over time."
      },
      {
        "title": "What are the most important shortcuts in SI?",
        "answer": "1. SI = (P × R × T)/100. 2. Amount = P + SI. 3. Doubling in T years → Rate = 100/T. 4. n-times in T years → Rate = ((n-1) × 100)/T."
      },
      {
        "title": "What mistakes should be avoided in SI?",
        "answer": "Do not confuse Amount with SI. Do not forget to convert months into years. Do not apply Compound Interest logic in SI questions."
      },
      {
        "title": "What is the biggest concept to remember in Simple Interest?",
        "answer": "Interest is always calculated only on the original principal. That is the entire foundation of Simple Interest."
      }
    ],



    "compound-intrest": [
      {
        "title": "What is Compound Interest?",
        "answer": "Compound Interest (CI) is interest calculated on both the original principal and the previously earned interest. This means every year the interest amount increases because the base amount keeps increasing."
      },
      {
        "title": "Why is it called interest on interest?",
        "answer": "Because after every time period, earned interest is added back to the principal. In the next period, interest is calculated on this new increased amount."
      },
      {
        "title": "Why does Compound Interest grow faster than Simple Interest?",
        "answer": "In Simple Interest, interest is always calculated on the original principal only. But in Compound Interest, interest gets added to principal every year, causing exponential growth."
      },
      {
        "title": "What is the most important formula of Compound Interest?",
        "answer": "Amount (A) = P(1 + R/100)^n"
      },
      {
        "title": "What is the formula for Compound Interest?",
        "answer": "Compound Interest (CI) = Amount - Principal = A - P"
      },
      {
        "title": "What do P, R, and n mean in CI?",
        "answer": "P = Principal amount, R = Rate of interest per year, n = Number of years or compounding periods."
      },
      {
        "title": "What is the complete logic behind Compound Interest?",
        "answer": "At the end of every year, interest is added to the principal. Therefore next year's interest is calculated on a bigger amount. This repeated growth creates compounding."
      },
      {
        "title": "How do we solve Compound Interest problems step by step?",
        "answer": "Step 1: Identify Principal (P), Rate (R), and Time (n). Step 2: Apply amount formula A = P(1 + R/100)^n. Step 3: Calculate amount. Step 4: Subtract principal from amount to get CI."
      },
      {
        "title": "Solve: Find amount on ₹1000 at 10% CI for 2 years.",
        "answer": "Step 1: P = 1000, R = 10%, n = 2 years. Step 2: Apply formula.  Step 3: A = 1000(1.1)^2 = 1000 × 1.21 = ₹1210. Final Answer = ₹1210."
      },
      {
        "title": "Solve: Find Compound Interest on ₹1000 at 10% for 2 years.",
        "answer": "Step 1: Amount = ₹1210. Step 2: CI = Amount - Principal = 1210 - 1000 = ₹210. Final Answer = ₹210."
      },
      {
        "title": "Complete conceptual explanation of ₹1000 at 10% for 2 years.",
        "answer": "Year 1: Interest = 10% of 1000 = ₹100. New amount = ₹1100. Year 2: Interest = 10% of 1100 = ₹110. Final amount = 1100 + 110 = ₹1210. Total CI = 100 + 110 = ₹210."
      },
      {
        "title": "What is the shortcut formula for 2-year CI?",
        "answer": "For 2 years: Net Percentage Increase = x + x + (x²/100), where x is the annual interest rate."
      },
      {
        "title": "Solve 10% compound increase for 2 years using shortcut.",
        "answer": "10 + 10 + (10×10)/100 = 20 + 1 = 21%. Therefore total increase = 21%. On ₹1000, increase = 21% of 1000 = ₹210."
      },
      {
        "title": "Why does the extra 1% appear in 10% compound increase?",
        "answer": "Because second year's interest is calculated not only on the principal but also on the first year's interest. This creates the extra growth term."
      },
      {
        "title": "Solve: Find amount on ₹5000 at 20% CI for 2 years.",
        "answer": "Step 1: Use shortcut increase percentage. 20 + 20 + (20×20)/100 = 40 + 4 = 44%. Step 2: Increase amount = 44% of 5000 = ₹2200. Step 3: Final Amount = 5000 + 2200 = ₹7200."
      },
      {
        "title": "Full conceptual explanation of ₹5000 at 20% for 2 years.",
        "answer": "Year 1: 20% of 5000 = ₹1000. New amount = ₹6000. Year 2: 20% of 6000 = ₹1200. Final amount = 6000 + 1200 = ₹7200. Total CI = ₹2200."
      },
      {
        "title": "How do we solve CI for 3 years quickly?",
        "answer": "Use repeated multiplication or compound growth logic. Example: 10% for 3 years → multiply by 1.1 three times."
      },
      {
        "title": "Solve: ₹2000 at 10% CI for 3 years.",
        "answer": "Step 1: Apply formula.  Step 2: 1.1³ = 1.331. Step 3: Amount = 2000 × 1.331 = ₹2662. Step 4: CI = 2662 - 2000 = ₹662."
      },
      {
        "title": "Shortcut thinking for 10% CI for 3 years.",
        "answer": "After 1 year → ×1.1, after 2 years → ×1.21, after 3 years → ×1.331. So overall increase = 33.1%."
      },
      {
        "title": "What is the difference between SI and CI using one example?",
        "answer": "Suppose ₹1000 at 10% for 2 years. In SI: Interest every year = ₹100, so total SI = ₹200. In CI: Year 1 interest = ₹100, Year 2 interest = ₹110, so total CI = ₹210. CI is larger because of compounding."
      },
      {
        "title": "How do we solve half-yearly or quarterly CI?",
        "answer": "Convert rate and time according to compounding periods. Example: In half-yearly compounding, divide rate by 2 and multiply time by 2."
      },
      {
        "title": "Solve: ₹1000 at 10% compounded half-yearly for 1 year.",
        "answer": "Step 1: Rate per half-year = 10/2 = 5%. Step 2: Number of periods = 2. Step 3: Apply formula.  Step 4: Amount = 1000 × 1.1025 = ₹1102.5. CI = ₹102.5."
      },
      {
        "title": "What are the most important shortcuts in Compound Interest?",
        "answer": "1. Amount = P(1 + R/100)^n. 2. CI = Amount - Principal. 3. For 2 years: x + x + x²/100. 4. Repeated percentage growth can be solved using multipliers like 1.1, 1.2, etc."
      },
      {
        "title": "What common mistakes should be avoided in CI?",
        "answer": "Do not confuse CI with SI. Do not forget exponent power. Do not directly multiply rate and time like SI. Always remember compounding increases the base every year."
      },
      {
        "title": "What is the biggest concept to remember in Compound Interest?",
        "answer": "Interest is added back to the principal after every period, so future interest is calculated on an ever-growing amount. This is the heart of Compound Interest."
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

  "profit-and-loss": [
    {
      "title": "What is Profit and Loss?",
      "answer": "Profit and Loss is a topic based on buying and selling of goods. If an item is sold for more than its cost price, there is profit. If sold for less, there is loss."
    },
    {
      "title": "What is Cost Price (CP)?",
      "answer": "Cost Price is the price at which an article is purchased."
    },
    {
      "title": "What is Selling Price (SP)?",
      "answer": "Selling Price is the price at which an article is sold."
    },
    {
      "title": "When do we get profit?",
      "answer": "Profit occurs when Selling Price is greater than Cost Price."
    },
    {
      "title": "When do we get loss?",
      "answer": "Loss occurs when Cost Price is greater than Selling Price."
    },
    {
      "title": "What is the formula for Profit?",
      "answer": "Profit = Selling Price - Cost Price = SP - CP"
    },
    {
      "title": "What is the formula for Loss?",
      "answer": "Loss = Cost Price - Selling Price = CP - SP"
    },
    {
      "title": "What is the formula for Profit Percentage?",
      "answer": "Profit% = (Profit / CP) × 100"
    },
    {
      "title": "What is the formula for Loss Percentage?",
      "answer": "Loss% = (Loss / CP) × 100"
    },
    {
      "title": "Why is Cost Price used in denominator?",
      "answer": "Because profit or loss is always measured relative to the original investment (Cost Price)."
    },
    {
      "title": "How do we solve Profit and Loss questions step by step?",
      "answer": "Step 1: Identify CP and SP. Step 2: Check whether SP > CP or SP < CP. Step 3: Find Profit or Loss. Step 4: Calculate percentage if required."
    },
    {
      "title": "Solve: An item bought for ₹1000 is sold for ₹1200. Find profit.",
      "answer": "Step 1: CP = 1000, SP = 1200. Step 2: Since SP > CP, there is profit. Step 3: Profit = 1200 - 1000 = ₹200. Final Answer = ₹200 profit."
    },
    {
      "title": "Shortcut method for: CP = 1000, SP = 1200.",
      "answer": "Direct subtraction: Profit = SP - CP = 200."
    },
    {
      "title": "Solve: Find profit percentage if CP = 500 and SP = 650.",
      "answer": "Step 1: Profit = 650 - 500 = ₹150. Step 2: Apply formula.  Step 3: Profit% = 30%. Final Answer = 30% profit."
    },
    {
      "title": "Shortcut method for: CP = 500 and SP = 650.",
      "answer": "Profit = 150. Since 150 is 30% of 500, Profit% = 30%."
    },
    {
      "title": "Solve: Find loss percentage if CP = 800 and SP = 720.",
      "answer": "Step 1: Loss = 800 - 720 = ₹80. Step 2: Apply formula.  Step 3: Loss% = 10%. Final Answer = 10% loss."
    },
    {
      "title": "Shortcut method for: CP = 800 and SP = 720.",
      "answer": "Loss = 80. Since 80 is 10% of 800, Loss% = 10%."
    },
    {
      "title": "How do we find Selling Price when profit percentage is given?",
      "answer": "Add profit percentage to Cost Price."
    },
    {
      "title": "Solve: A shopkeeper sells an article at 25% profit. If CP is ₹400, find SP.",
      "answer": "Step 1: Profit = 25% of 400 = ₹100. Step 2: SP = CP + Profit = 400 + 100 = ₹500. Final Answer = ₹500."
    },
    {
      "title": "Shortcut for: 25% profit on ₹400.",
      "answer": "SP = 125% of 400 = (125/100) × 400 = ₹500."
    },
    {
      "title": "How do we find Cost Price when loss percentage is given?",
      "answer": "Use remaining percentage after loss. Example: 20% loss means SP = 80% of CP."
    },
    {
      "title": "Solve: An article is sold at 20% loss for ₹800. Find CP.",
      "answer": "Step 1: 20% loss means SP = 80% of CP. Step 2: 80% of CP = 800. Step 3: CP = (800 × 100)/80 = ₹1000. Final Answer = ₹1000."
    },
    {
      "title": "Shortcut for: Sold at 20% loss for ₹800.",
      "answer": "CP = 800 × (100/80) = ₹1000."
    },
    {
      "title": "Solve: Find SP if CP is ₹1000 and profit is 15%.",
      "answer": "Step 1: Profit = 15% of 1000 = ₹150. Step 2: SP = 1000 + 150 = ₹1150. Final Answer = ₹1150."
    },
    {
      "title": "Shortcut for: CP = ₹1000 and profit = 15%.",
      "answer": "SP = 115% of 1000 = ₹1150."
    },
    {
      "title": "Solve: Find CP if SP is ₹900 and loss is 10%.",
      "answer": "Step 1: 10% loss means SP = 90% of CP. Step 2: 90% of CP = 900. Step 3: CP = (900 × 100)/90 = ₹1000. Final Answer = ₹1000."
    },
    {
      "title": "Shortcut for: SP = ₹900 and loss = 10%.",
      "answer": "CP = 900 × (100/90) = ₹1000."
    },
    {
      "title": "Solve: A seller gains ₹50 on selling an item for ₹450. Find CP.",
      "answer": "Step 1: SP = ₹450, Profit = ₹50. Step 2: CP = SP - Profit = 450 - 50 = ₹400. Final Answer = ₹400."
    },
    {
      "title": "Shortcut for: Gain ₹50 on selling price ₹450.",
      "answer": "CP = 450 - 50 = ₹400."
    },
    {
      "title": "Solve: If an item is sold at double the CP, find profit percentage.",
      "answer": "Suppose CP = ₹100. Then SP = ₹200. Profit = 200 - 100 = ₹100. Profit% = (100/100) × 100 = 100%. Final Answer = 100% profit."
    },
    {
      "title": "Shortcut for: Item sold at double CP.",
      "answer": "Double CP means SP = 200% of CP. Therefore profit = 100%."
    },
    {
      "title": "What happens when SP = CP?",
      "answer": "There is neither profit nor loss because selling price and cost price are equal."
    },
    {
      "title": "Solve: A shopkeeper buys 10 apples for ₹100 and sells each for ₹15. Find profit.",
      "answer": "Step 1: CP of 10 apples = ₹100. Step 2: SP of 10 apples = 10 × 15 = ₹150. Step 3: Profit = 150 - 100 = ₹50. Final Answer = ₹50 profit."
    },
    {
      "title": "Shortcut for apple question.",
      "answer": "10 apples sold at ₹15 each means total SP = ₹150. Profit = 150 - 100 = ₹50."
    },
    {
      "title": "What are the fastest shortcut formulas in Profit and Loss?",
      "answer": "1. Profit = SP - CP. 2. Loss = CP - SP. 3. Profit% = (Profit/CP) × 100. 4. Loss% = (Loss/CP) × 100. 5. SP = CP × (100 + Profit%)/100. 6. CP = SP × 100/(100 - Loss%)."
    },
    {
      "title": "What common mistakes should be avoided?",
      "answer": "Do not use SP in denominator for percentage calculations. Always use CP. Also carefully identify whether question is about profit or loss."
    },
    {
      "title": "What is the biggest concept to remember in Profit and Loss?",
      "answer": "Everything revolves around Cost Price because profit and loss percentages are always calculated on CP."
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
      "title": "What are cyclicity patterns of unit digits from 1 to 9?",
      "answer": "1 → 1 (cyclicity = 1)\n2 → 2,4,8,6 (cyclicity = 4)\n3 → 3,9,7,1 (cyclicity = 4)\n4 → 4,6 (cyclicity = 2)\n5 → 5 (cyclicity = 1)\n6 → 6 (cyclicity = 1)\n7 → 7,9,3,1 (cyclicity = 4)\n8 → 8,4,2,6 (cyclicity = 4)\n9 → 9,1 (cyclicity = 2)"
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
    "title": "What is calendar aptitude?",
    "answer": "Calendar aptitude is a topic used to find days, dates, leap years, odd days, and weekday calculations. The entire topic is based on counting total odd days because weekdays repeat after every 7 days."
  },
  {
    "title": "What is a week?",
    "answer": "1 week = 7 days. Since weekdays repeat after every 7 days, multiples of 7 create complete cycles."
  },
  {
    "title": "What are odd days?",
    "answer": "Odd days are the remaining days after removing complete weeks. Example: 9 days = 7 + 2, so odd days = 2."
  },
  {
    "title": "Why are odd days important?",
    "answer": "Odd days help determine the day of the week because every extra odd day shifts the weekday forward by one."
  },
  {
    "title": "How many days are in an ordinary year?",
    "answer": "Ordinary year = 365 days."
  },
  {
    "title": "How many odd days are in an ordinary year?",
    "answer": "365 = 52 weeks + 1 day. Therefore ordinary year has 1 odd day."
  },
  {
    "title": "How many days are in a leap year?",
    "answer": "Leap year = 366 days."
  },
  {
    "title": "How many odd days are in a leap year?",
    "answer": "366 = 52 weeks + 2 days. Therefore leap year has 2 odd days."
  },
  {
    "title": "What is a leap year?",
    "answer": "A leap year has 366 days instead of 365 days. February contains 29 days in a leap year."
  },
  {
    "title": "What is the leap year rule?",
    "answer": "A year divisible by 4 is generally a leap year."
  },
  {
    "title": "What is the century leap year rule?",
    "answer": "Century years must be divisible by 400 to become leap years."
  },
  {
    "title": "Why is 1900 not a leap year?",
    "answer": "1900 is divisible by 100 but not divisible by 400, so it is not a leap year."
  },
  {
    "title": "Why is 2000 a leap year?",
    "answer": "2000 is divisible by 400, so it is a leap year."
  },
  {
    "title": "How many odd days are in 52 weeks?",
    "answer": "52 weeks = 52 × 7 = 364 days. Therefore odd days = 0."
  },
  {
    "title": "How do weekdays move because of odd days?",
    "answer": "1 odd day shifts weekday by 1. 2 odd days shift by 2. Example: Monday + 2 odd days = Wednesday."
  },
  {
    "title": "Day sequence in calendar.",
    "answer": "Sunday → Monday → Tuesday → Wednesday → Thursday → Friday → Saturday → Sunday."
  },
  {
    "title": "What day comes after Tuesday?",
    "answer": "Wednesday."
  },
  {
    "title": "What day comes before Monday?",
    "answer": "Sunday."
  },
  {
    "title": "If today is Monday, what day after 10 days?",
    "answer": "Step 1: Divide 10 by 7. Step 2: Remainder = 3. Step 3: Move 3 days after Monday → Tuesday, Wednesday, Thursday. Final Answer = Thursday."
  },
  {
    "title": "Shortcut for day after many days.",
    "answer": "Divide total days by 7 and use remainder only because complete weeks do not affect weekday."
  },
  {
    "title": "If today is Friday, what day after 100 days?",
    "answer": "100 mod 7 = 2. Move 2 days after Friday → Saturday, Sunday. Final Answer = Sunday."
  },
  {
    "title": "If today is Sunday, what day after 200 days?",
    "answer": "200 mod 7 = 4. Move 4 days after Sunday → Monday, Tuesday, Wednesday, Thursday. Final Answer = Thursday."
  },
  {
    "title": "How many odd days are in 100 years?",
    "answer": "In 100 years: 76 ordinary years and 24 leap years. Odd days = (76 × 1) + (24 × 2) = 124 odd days. 124 mod 7 = 5. Final Answer = 5 odd days."
  },
  {
    "title": "How many odd days are in 200 years?",
    "answer": "Every 100 years contribute 5 odd days. Therefore 200 years = 5 + 5 = 10 odd days. 10 mod 7 = 3 odd days."
  },
  {
    "title": "How many odd days are in 300 years?",
    "answer": "300 years = 5 + 5 + 5 = 15 odd days. 15 mod 7 = 1 odd day."
  },
  {
    "title": "How many odd days are in 400 years?",
    "answer": "400 years contain exactly 0 odd days because total odd days become divisible by 7. Hence calendar repeats every 400 years."
  },
  {
    "title": "Why does calendar repeat after 400 years?",
    "answer": "Because total odd days in 400 years become a complete multiple of 7, causing weekdays and dates to repeat."
  },
  {
    "title": "Month codes based on odd days in ordinary year.",
    "answer": "January = 3, February = 0, March = 3, April = 2, May = 3, June = 2, July = 3, August = 3, September = 2, October = 3, November = 2, December = 3."
  },
  {
    "title": "How many odd days are in January?",
    "answer": "January has 31 days = 28 + 3. Therefore odd days = 3."
  },
  {
    "title": "How many odd days are in February in ordinary year?",
    "answer": "February has 28 days = 4 complete weeks. Therefore odd days = 0."
  },
  {
    "title": "How many odd days are in February in leap year?",
    "answer": "February has 29 days = 28 + 1. Therefore odd days = 1."
  },
  {
    "title": "How do we find day on a given date?",
    "answer": "Step 1: Count odd days from years. Step 2: Add odd days from months. Step 3: Add odd days from dates. Step 4: Divide total by 7 and use remainder to determine weekday."
  },
  {
    "title": "What day was on 1 Jan 2023?",
    "answer": "1 January 2023 was Sunday."
  },
  {
    "title": "Find day on 1 Jan 2024.",
    "answer": "2023 was ordinary year with 1 odd day. 1 Jan 2023 = Sunday. Adding 1 odd day gives Monday. Final Answer = Monday."
  },
  {
    "title": "Find day on 1 Jan 2025.",
    "answer": "2024 is leap year with 2 odd days. 1 Jan 2024 = Monday. Add 2 odd days → Wednesday. Final Answer = Wednesday."
  },
  {
    "title": "Find day on 15 August 1947.",
    "answer": "15 August 1947 was Friday."
  },
  {
    "title": "How do we solve backward day problems?",
    "answer": "Instead of moving forward, move backward using subtraction. Example: Monday - 2 days = Saturday."
  },
  {
    "title": "If today is Wednesday, what day was 20 days ago?",
    "answer": "20 mod 7 = 6. Move 6 days backward from Wednesday → Tuesday, Monday, Sunday, Saturday, Friday, Thursday. Final Answer = Thursday."
  },
  {
    "title": "What is the biggest shortcut in calendar problems?",
    "answer": "Always reduce days using modulo 7 because only remainder affects weekdays."
  },
  {
    "title": "Most important odd day shortcuts.",
    "answer": "1 ordinary year = 1 odd day. 1 leap year = 2 odd days. 100 years = 5 odd days. 200 years = 3 odd days. 300 years = 1 odd day. 400 years = 0 odd days."
  },
  {
    "title": "What common mistakes should be avoided in calendar problems?",
    "answer": "Do not forget leap year conditions. Do not count complete weeks. Always use remainder after division by 7. Carefully handle century years like 1700, 1800, 1900."
  },
  {
    "title": "What is the most important concept in calendar aptitude?",
    "answer": "Weekdays repeat every 7 days. Therefore only odd days matter in every calendar calculation."
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