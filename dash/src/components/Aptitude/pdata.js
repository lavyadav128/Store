const questionsData = {

    "multiplications": [
        {
          "title": "What is the base method multiplication trick?",
          "answer": "In base method, we multiply numbers close to 10, 100, 1000 etc using their difference from the base."
        },
        {
          "title": "How do we solve 103 × 107 using base 100?",
          "answer": "103 is +3 and 107 is +7 from 100. Cross add = 110. Multiply differences = 21. Answer = 11021."
        },
        {
          "title": "How do we solve 91 × 87 using base 100?",
          "answer": "91 is -9 and 87 is -13 from 100. Cross subtract = 78. Multiply differences = 117. Keep 2 digits = 17 and carry 1. Answer = 7917."
        },
        {
          "title": "Why do we keep fixed digits on the right side?",
          "answer": "Because the number of zeros in base decides right side digits. Base 100 means 2 digits."
        },
        {
          "title": "How do signs work in multiplication tricks?",
          "answer": "Same signs give positive multiplication. Different signs create subtraction."
        }
      ],


      
"squaring":[
    {
      "title": "How do we square numbers close to 100?",
      "answer": "Find difference from 100. Left part = number ± difference. Right part = square of difference."
    },
    {
      "title": "How do we find 98²?",
      "answer": "98 is -2 from 100. Left = 96. Right = 04. Answer = 9604."
    },
    {
      "title": "How do we find 87²?",
      "answer": "87 is -13 from 100. Left = 74. Right = 169. Keep 69 and carry 1. Final answer = 7569."
    },
    {
      "title": "Why do we carry digits in squaring tricks?",
      "answer": "Because right side must contain fixed digits according to base."
    }
  ],



"squareroot":[
    {
      "title": "How do we identify square roots quickly?",
      "answer": "Check last digit and nearest perfect square range."
    },
    {
      "title": "How do we find √2401?",
      "answer": "2401 ends with 01 so root ends with 1 or 9. Since it is near 2500, answer = 49."
    },
    {
      "title": "How do we find √3136?",
      "answer": "3136 ends with 6 so root ends with 4 or 6. Number lies between 50² and 60². Answer = 56."
    },
    {
      "title": "How do we find √1024?",
      "answer": "1024 ends with 4 so root ends with 2 or 8. Number lies between 30² and 40². Answer = 32."
    }
  ],



"percentage":[
    {
      "title": "What is percentage change formula?",
      "answer": "Percentage change = ((Final - Initial) / Initial) × 100."
    },
    {
      "title": "What is the a-b theorem?",
      "answer": "Net percentage change = a + b + (ab/100)."
    },
    {
      "title": "How do signs work in a-b theorem?",
      "answer": "Increase uses positive sign and decrease uses negative sign."
    },
    {
      "title": "What is net increase when value increases by 10% two times?",
      "answer": "10 + 10 + (10×10)/100 = 21% increase."
    },
    {
      "title": "What is net change when value increases by 20% and decreases by 10%?",
      "answer": "20 - 10 + (20×-10)/100 = 8% increase."
    }
  ],



"pass-fail": [
    {
      "title": "How do we solve pass-fail questions?",
      "answer": "Take total marks as 100 unless given otherwise and compare pass percentage with obtained percentage."
    },
    {
      "title": "A student needs 35% to pass and got 25%, failing by 40 marks. Find total marks.",
      "answer": "Difference = 10%. If 10% = 40 marks then 100% = 400 marks."
    },
    {
      "title": "If passing marks are 40% and student gets 30% failing by 20 marks, find total marks.",
      "answer": "Difference = 10%. If 10% = 20 then total marks = 200."
    }
  ],



"consumption":[
    {
      "title": "What happens to consumption when price increases?",
      "answer": "Consumption decreases if expenditure remains constant."
    },
    {
      "title": "What is formula for reduction in consumption?",
      "answer": "Reduction = (100x)/(100 + x)%."
    },
    {
      "title": "What is formula for increase in consumption?",
      "answer": "Increase = (100x)/(100 - x)%."
    },
    {
      "title": "If price increases by 25%, how much should consumption reduce?",
      "answer": "Reduction = (100×25)/(100+25) = 20%."
    }
  ],



"simple-intrest":[
    {
      "title": "What is Simple Interest formula?",
      "answer": "SI = (P × R × T) / 100."
    },
    {
      "title": "What is amount formula in SI?",
      "answer": "Amount = Principal + Simple Interest."
    },
    {
      "title": "What do P, R and T mean?",
      "answer": "P = Principal, R = Rate, T = Time."
    },
    {
      "title": "Find SI on ₹500 at 5% for 1 year.",
      "answer": "SI = (500×5×1)/100 = ₹25."
    },
    {
      "title": "A sum doubles in 20 years at SI. Find rate.",
      "answer": "100% increase in 20 years means 5% per year."
    },
    {
      "title": "A sum becomes four times in 30 years at SI. Find rate.",
      "answer": "300% increase in 30 years means 10% rate."
    }
  ],



"compound-intrest":[
    {
      "title": "What is Compound Interest?",
      "answer": "Interest calculated on principal plus previous interest."
    },
    {
      "title": "What is CI amount formula?",
      "answer": "A = P(1 + R/100)^n."
    },
    {
      "title": "What is difference between SI and CI?",
      "answer": "SI is only on principal while CI is on principal plus interest."
    },
    {
      "title": "Find amount on ₹1000 at 10% CI for 2 years.",
      "answer": "A = 1000(1.1)^2 = ₹1210."
    },
    {
      "title": "Find CI on ₹1000 at 10% for 2 years.",
      "answer": "CI = 1210 - 1000 = ₹210."
    },
    {
      "title": "What is shortcut for 2 year CI?",
      "answer": "x + x + (x²/100)."
    },
    {
      "title": "What is compound increase for 10% in 2 years?",
      "answer": "10 + 10 + (10×10)/100 = 21%."
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