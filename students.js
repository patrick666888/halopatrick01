let studentGrades = [
    // [姓名, 國文, 英文, 數學]
    ['小明', 85, 92, 78],
    ['小華', 90, 85, 95],
    ['小李', 88, 88, 82],
  ]
  let chinese = 1
  let english = 2
  let math =3
  
  // 取得小華的英文成績
  console.log(studentGrades[1][2]) // 85
  
  // 計算小明的平均分數
  let 小明成績 = studentGrades[0].slice(1) // [85, 92, 78]
  let 平均分數 = 小明成績.reduce((sum, score) => sum + score, 0) / 小明成績.length
  console.log(平均分數) // 85
  
  // 印出所有學生的成績單
  studentGrades.forEach(student => {
    console.log(`${student[0]} 的成績：`)
    console.log(`國文：${student[1]}`)
    console.log(`英文：${student[2]}`)
    console.log(`數學：${student[3]}`)
    console.log('-------------------')
  })