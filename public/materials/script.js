document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded");
    fetchAllFiles();
    fetchDataFromMongo();
});

const fileContainer = document.getElementById('fileContainer');
const linksRight = document.querySelector('.linksRight')
let dataFolders;
// try {
    // let response = await fetch('/api/pdfs');
    // let data = await response.json();
    // console.log(data);
let dataFiles = [];
// async function fetchDataFromMongo() {

//         let data = {
//     "OS": [
//         {
//             "name": "operating system.pdf",
//             "path": "OS/operating system.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/OS/operating%20system.pdf"
//         }
//     ],
//     "R programming": [
//         {
//             "name": "Intro2R.pdf",
//             "path": "R programming/Intro2R.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/Intro2R.pdf"
//         },
//         {
//             "name": "LectureNotes.pdf",
//             "path": "R programming/LectureNotes.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/LectureNotes.pdf"
//         },
//         {
//             "name": "R_Programming_Course_Notes.pdf",
//             "path": "R programming/R_Programming_Course_Notes.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/R_Programming_Course_Notes.pdf"
//         },
//         {
//             "name": "The Art of R Programming.pdf",
//             "path": "R programming/The Art of R Programming.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/The%20Art%20of%20R%20Programming.pdf"
//         },
//         {
//             "name": "The_Book_of_R.pdf",
//             "path": "R programming/The_Book_of_R.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/The_Book_of_R.pdf"
//         },
//         {
//             "name": "r_tutorial.pdf",
//             "path": "R programming/r_tutorial.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/r_tutorial.pdf"
//         }
//     ],
//     "Soft skills - apt, reasoning etc": [
//         {
//             "name": "0fca830c5ac4e68dac0164352da910bf.pdf",
//             "path": "Soft skills - apt, reasoning etc/0fca830c5ac4e68dac0164352da910bf.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/0fca830c5ac4e68dac0164352da910bf.pdf"
//         },
//         {
//             "name": "1091bookf_ReasoningAptitude2021.pdf",
//             "path": "Soft skills - apt, reasoning etc/1091bookf_ReasoningAptitude2021.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/1091bookf_ReasoningAptitude2021.pdf"
//         },
//         {
//             "name": "1583303084585-FINAL MCQ FOR ALP (PROMOTIVE).pdf",
//             "path": "Soft skills - apt, reasoning etc/1583303084585-FINAL MCQ FOR ALP (PROMOTIVE).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/1583303084585-FINAL%20MCQ%20FOR%20ALP%20(PROMOTIVE).pdf"
//         },
//         {
//             "name": "200-Questions-of-Quantitative-Aptitude.pdf",
//             "path": "Soft skills - apt, reasoning etc/200-Questions-of-Quantitative-Aptitude.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/200-Questions-of-Quantitative-Aptitude.pdf"
//         },
//         {
//             "name": "235262103-NTSE-Sample-Papers-for-Class-10-Stage-II-MAT.pdf",
//             "path": "Soft skills - apt, reasoning etc/235262103-NTSE-Sample-Papers-for-Class-10-Stage-II-MAT.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/235262103-NTSE-Sample-Papers-for-Class-10-Stage-II-MAT.pdf"
//         },
//         {
//             "name": "4966d784-a71b-4c11-b31e-801ee59d95c0-1571828515642-quantitative-aptitude.pdf",
//             "path": "Soft skills - apt, reasoning etc/4966d784-a71b-4c11-b31e-801ee59d95c0-1571828515642-quantitative-aptitude.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/4966d784-a71b-4c11-b31e-801ee59d95c0-1571828515642-quantitative-aptitude.pdf"
//         },
//         {
//             "name": "Aptitude-Test-.pdf",
//             "path": "Soft skills - apt, reasoning etc/Aptitude-Test-.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Aptitude-Test-.pdf"
//         },
//         {
//             "name": "CampusRecruitmentBook.pdf",
//             "path": "Soft skills - apt, reasoning etc/CampusRecruitmentBook.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/CampusRecruitmentBook.pdf"
//         },
//         {
//             "name": "Dates and Years.pdf",
//             "path": "Soft skills - apt, reasoning etc/Dates and Years.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Dates%20and%20Years.pdf"
//         },
//         {
//             "name": "Final Reasoning & Aptitude.pdf",
//             "path": "Soft skills - apt, reasoning etc/Final Reasoning & Aptitude.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Final%20Reasoning%20&%20Aptitude.pdf"
//         },
//         {
//             "name": "GuideForTeachers.pdf",
//             "path": "Soft skills - apt, reasoning etc/GuideForTeachers.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/GuideForTeachers.pdf"
//         },
//         {
//             "name": "QT-Cheatsheet.pdf",
//             "path": "Soft skills - apt, reasoning etc/QT-Cheatsheet.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/QT-Cheatsheet.pdf"
//         },
//         {
//             "name": "QT-TRICKS.pdf",
//             "path": "Soft skills - apt, reasoning etc/QT-TRICKS.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/QT-TRICKS.pdf"
//         },
//         {
//             "name": "Quantitative-Verbal-Aptitude.pdf",
//             "path": "Soft skills - apt, reasoning etc/Quantitative-Verbal-Aptitude.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Quantitative-Verbal-Aptitude.pdf"
//         },
//         {
//             "name": "SECC II SPECIAL COURSE (1).pdf",
//             "path": "Soft skills - apt, reasoning etc/SECC II SPECIAL COURSE (1).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/SECC%20II%20SPECIAL%20COURSE%20(1).pdf"
//         },
//         {
//             "name": "aptitude.pdf",
//             "path": "Soft skills - apt, reasoning etc/aptitude.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/aptitude.pdf"
//         },
//         {
//             "name": "banking-book.pdf",
//             "path": "Soft skills - apt, reasoning etc/banking-book.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/banking-book.pdf"
//         },
//         {
//             "name": "e7dd002f5f21f4c066f598ffb4731ea0_RS Agarwal Verbal & Nonverbal.pdf",
//             "path": "Soft skills - apt, reasoning etc/e7dd002f5f21f4c066f598ffb4731ea0_RS Agarwal Verbal & Nonverbal.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/e7dd002f5f21f4c066f598ffb4731ea0_RS%20Agarwal%20Verbal%20&%20Nonverbal.pdf"
//         },
//         {
//             "name": "ga.pdf",
//             "path": "Soft skills - apt, reasoning etc/ga.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/ga.pdf"
//         },
//         {
//             "name": "logical-reasoning.pdf",
//             "path": "Soft skills - apt, reasoning etc/logical-reasoning.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/logical-reasoning.pdf"
//         },
//         {
//             "name": "quantitative-aptitude-ramandeep-singh.pdf",
//             "path": "Soft skills - apt, reasoning etc/quantitative-aptitude-ramandeep-singh.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/quantitative-aptitude-ramandeep-singh.pdf"
//         }
//     ],
//     "Soft": [
//         {
//             "name": "CareerDevelopment-Interviews.pdf",
//             "path": "Soft/CareerDevelopment-Interviews.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/CareerDevelopment-Interviews.pdf"
//         },
//         {
//             "name": "SoftSkillandEnglishCommunication_75Q.pdf",
//             "path": "Soft/SoftSkillandEnglishCommunication_75Q.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/SoftSkillandEnglishCommunication_75Q.pdf"
//         },
//         {
//             "name": "TALLY-9.0-PDF.pdf",
//             "path": "Soft/TALLY-9.0-PDF.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/TALLY-9.0-PDF.pdf"
//         },
//         {
//             "name": "gate_cse_study_material_91.pdf",
//             "path": "Soft/gate_cse_study_material_91.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/gate_cse_study_material_91.pdf"
//         },
//         {
//             "name": "linked-in-interview-ebook-10-11-17-en.pdf",
//             "path": "Soft/linked-in-interview-ebook-10-11-17-en.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/linked-in-interview-ebook-10-11-17-en.pdf"
//         },
//         {
//             "name": "soft-skills-interview-questions.pdf",
//             "path": "Soft/soft-skills-interview-questions.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/soft-skills-interview-questions.pdf"
//         }
//     ],
//     "Spring boot": [
//         {
//             "name": "Spring-Boot-Interview-Questions (1) (1).pdf",
//             "path": "Spring boot/Spring-Boot-Interview-Questions (1) (1).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/Spring-Boot-Interview-Questions%20(1)%20(1).pdf"
//         },
//         {
//             "name": "Spring-Interview-Questions (1).pdf",
//             "path": "Spring boot/Spring-Interview-Questions (1).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/Spring-Interview-Questions%20(1).pdf"
//         },
//         {
//             "name": "Spring.pdf",
//             "path": "Spring boot/Spring.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/Spring.pdf"
//         },
//         {
//             "name": "spring-boot-interview-questions (2).pdf",
//             "path": "Spring boot/spring-boot-interview-questions (2).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/spring-boot-interview-questions%20(2).pdf"
//         },
//         {
//             "name": "spring_boot_tutorial.pdf",
//             "path": "Spring boot/spring_boot_tutorial.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/spring_boot_tutorial.pdf"
//         }
//     ],
//     "plsql": [
//         {
//             "name": "b14261.pdf",
//             "path": "plsql/b14261.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/plsql/b14261.pdf"
//         },
//         {
//             "name": "plsql_tutorial.pdf",
//             "path": "plsql/plsql_tutorial.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/plsql/plsql_tutorial.pdf"
//         }
//     ],
//     "power bi": [
//         {
//             "name": "Croma_Campus_-_Professional_in_Data_Analytics_with_PowerBI.pdf",
//             "path": "power bi/Croma_Campus_-_Professional_in_Data_Analytics_with_PowerBI.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Croma_Campus_-_Professional_in_Data_Analytics_with_PowerBI.pdf"
//         },
//         {
//             "name": "Microsoft_Press_ebook_Introducing_Power_BI_PDF_mobile.pdf",
//             "path": "power bi/Microsoft_Press_ebook_Introducing_Power_BI_PDF_mobile.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Microsoft_Press_ebook_Introducing_Power_BI_PDF_mobile.pdf"
//         },
//         {
//             "name": "Power BI for Beginners_📊.pdf",
//             "path": "power bi/Power BI for Beginners_📊.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Power%20BI%20for%20Beginners_%F0%9F%93%8A.pdf"
//         },
//         {
//             "name": "PowerBI-Online-Training (1).pdf",
//             "path": "power bi/PowerBI-Online-Training (1).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/PowerBI-Online-Training%20(1).pdf"
//         },
//         {
//             "name": "PowerBI-Online-Training.pdf",
//             "path": "power bi/PowerBI-Online-Training.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/PowerBI-Online-Training.pdf"
//         },
//         {
//             "name": "Unlocking the power of Excel ✅.pdf",
//             "path": "power bi/Unlocking the power of Excel ✅.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Unlocking%20the%20power%20of%20Excel%20%E2%9C%85.pdf"
//         }
//     ],
//     "selenium": [
//         {
//             "name": "Complete Selenium  Breakdown (1).pdf",
//             "path": "selenium/Complete Selenium  Breakdown (1).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/Complete%20Selenium%20%20Breakdown%20(1).pdf"
//         },
//         {
//             "name": "SELENIUM (1).pdf",
//             "path": "selenium/SELENIUM (1).pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/SELENIUM%20(1).pdf"
//         },
//         {
//             "name": "Selenium Full Material Updated Greens.pdf",
//             "path": "selenium/Selenium Full Material Updated Greens.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/Selenium%20Full%20Material%20Updated%20Greens.pdf"
//         },
//         {
//             "name": "Selenium-Testing-course-Content.pdf",
//             "path": "selenium/Selenium-Testing-course-Content.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/Selenium-Testing-course-Content.pdf"
//         },
//         {
//             "name": "TestAutomationusingSeleniumWebDriverJavaPreview.pdf",
//             "path": "selenium/TestAutomationusingSeleniumWebDriverJavaPreview.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/TestAutomationusingSeleniumWebDriverJavaPreview.pdf"
//         },
//         {
//             "name": "selenium-tutorial.pdf",
//             "path": "selenium/selenium-tutorial.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/selenium-tutorial.pdf"
//         },
//         {
//             "name": "selenium_tutorial.pdf",
//             "path": "selenium/selenium_tutorial.pdf",
//             "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/selenium_tutorial.pdf"
//         }
//     ]
// }


//     try{
//         data.forEach(d => {
//             const div = document.createElement('div');
//             div.className = 'link-container';
//             div.textContent = d.folderName;

//             div.addEventListener('click', async () => {
//                 console.log('Clicked:', d.folderName);
//                 console.log("dataFiles:", dataFiles);
                
//                 document.querySelector('.rightMainContainer').classList.remove('hidden');
//                 linksRight.textContent = ''; // Clear previous content
            
//                 const abc = dataFiles.filter(file => file.folderName.includes(d.folderName));
            
//                 abc.forEach(ab => {
//                     const a = document.createElement('a');
//                     a.className = 'rightLinks';
//                     a.textContent = ab.fileName;
//                     a.href = ab.fileLink;
//                     linksRight.appendChild(a);
//                     const br = document.createElement('br');
//                     linksRight.appendChild(br);
//                 });
//             });
            

//             fileContainer.appendChild(div);
//         });
//     }catch(err){
//         console.log(err);
//     }
// }

async function fetchDataFromMongo() {
    // Mock data as you've shown
    let data = {
        
    "OS": [
        {
            "name": "operating system.pdf",
            "path": "OS/operating system.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/OS/operating%20system.pdf"
        }
    ],
    "R programming": [
        {
            "name": "Intro2R.pdf",
            "path": "R programming/Intro2R.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/Intro2R.pdf"
        },
        {
            "name": "LectureNotes.pdf",
            "path": "R programming/LectureNotes.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/LectureNotes.pdf"
        },
        {
            "name": "R_Programming_Course_Notes.pdf",
            "path": "R programming/R_Programming_Course_Notes.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/R_Programming_Course_Notes.pdf"
        },
        {
            "name": "The Art of R Programming.pdf",
            "path": "R programming/The Art of R Programming.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/The%20Art%20of%20R%20Programming.pdf"
        },
        {
            "name": "The_Book_of_R.pdf",
            "path": "R programming/The_Book_of_R.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/The_Book_of_R.pdf"
        },
        {
            "name": "r_tutorial.pdf",
            "path": "R programming/r_tutorial.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/R%20programming/r_tutorial.pdf"
        }
    ],
    "Soft skills - apt, reasoning etc": [
        {
            "name": "0fca830c5ac4e68dac0164352da910bf.pdf",
            "path": "Soft skills - apt, reasoning etc/0fca830c5ac4e68dac0164352da910bf.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/0fca830c5ac4e68dac0164352da910bf.pdf"
        },
        {
            "name": "1091bookf_ReasoningAptitude2021.pdf",
            "path": "Soft skills - apt, reasoning etc/1091bookf_ReasoningAptitude2021.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/1091bookf_ReasoningAptitude2021.pdf"
        },
        {
            "name": "1583303084585-FINAL MCQ FOR ALP (PROMOTIVE).pdf",
            "path": "Soft skills - apt, reasoning etc/1583303084585-FINAL MCQ FOR ALP (PROMOTIVE).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/1583303084585-FINAL%20MCQ%20FOR%20ALP%20(PROMOTIVE).pdf"
        },
        {
            "name": "200-Questions-of-Quantitative-Aptitude.pdf",
            "path": "Soft skills - apt, reasoning etc/200-Questions-of-Quantitative-Aptitude.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/200-Questions-of-Quantitative-Aptitude.pdf"
        },
        {
            "name": "235262103-NTSE-Sample-Papers-for-Class-10-Stage-II-MAT.pdf",
            "path": "Soft skills - apt, reasoning etc/235262103-NTSE-Sample-Papers-for-Class-10-Stage-II-MAT.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/235262103-NTSE-Sample-Papers-for-Class-10-Stage-II-MAT.pdf"
        },
        {
            "name": "4966d784-a71b-4c11-b31e-801ee59d95c0-1571828515642-quantitative-aptitude.pdf",
            "path": "Soft skills - apt, reasoning etc/4966d784-a71b-4c11-b31e-801ee59d95c0-1571828515642-quantitative-aptitude.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/4966d784-a71b-4c11-b31e-801ee59d95c0-1571828515642-quantitative-aptitude.pdf"
        },
        {
            "name": "Aptitude-Test-.pdf",
            "path": "Soft skills - apt, reasoning etc/Aptitude-Test-.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Aptitude-Test-.pdf"
        },
        {
            "name": "CampusRecruitmentBook.pdf",
            "path": "Soft skills - apt, reasoning etc/CampusRecruitmentBook.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/CampusRecruitmentBook.pdf"
        },
        {
            "name": "Dates and Years.pdf",
            "path": "Soft skills - apt, reasoning etc/Dates and Years.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Dates%20and%20Years.pdf"
        },
        {
            "name": "Final Reasoning & Aptitude.pdf",
            "path": "Soft skills - apt, reasoning etc/Final Reasoning & Aptitude.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Final%20Reasoning%20&%20Aptitude.pdf"
        },
        {
            "name": "GuideForTeachers.pdf",
            "path": "Soft skills - apt, reasoning etc/GuideForTeachers.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/GuideForTeachers.pdf"
        },
        {
            "name": "QT-Cheatsheet.pdf",
            "path": "Soft skills - apt, reasoning etc/QT-Cheatsheet.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/QT-Cheatsheet.pdf"
        },
        {
            "name": "QT-TRICKS.pdf",
            "path": "Soft skills - apt, reasoning etc/QT-TRICKS.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/QT-TRICKS.pdf"
        },
        {
            "name": "Quantitative-Verbal-Aptitude.pdf",
            "path": "Soft skills - apt, reasoning etc/Quantitative-Verbal-Aptitude.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/Quantitative-Verbal-Aptitude.pdf"
        },
        {
            "name": "SECC II SPECIAL COURSE (1).pdf",
            "path": "Soft skills - apt, reasoning etc/SECC II SPECIAL COURSE (1).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/SECC%20II%20SPECIAL%20COURSE%20(1).pdf"
        },
        {
            "name": "aptitude.pdf",
            "path": "Soft skills - apt, reasoning etc/aptitude.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/aptitude.pdf"
        },
        {
            "name": "banking-book.pdf",
            "path": "Soft skills - apt, reasoning etc/banking-book.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/banking-book.pdf"
        },
        {
            "name": "e7dd002f5f21f4c066f598ffb4731ea0_RS Agarwal Verbal & Nonverbal.pdf",
            "path": "Soft skills - apt, reasoning etc/e7dd002f5f21f4c066f598ffb4731ea0_RS Agarwal Verbal & Nonverbal.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/e7dd002f5f21f4c066f598ffb4731ea0_RS%20Agarwal%20Verbal%20&%20Nonverbal.pdf"
        },
        {
            "name": "ga.pdf",
            "path": "Soft skills - apt, reasoning etc/ga.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/ga.pdf"
        },
        {
            "name": "logical-reasoning.pdf",
            "path": "Soft skills - apt, reasoning etc/logical-reasoning.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/logical-reasoning.pdf"
        },
        {
            "name": "quantitative-aptitude-ramandeep-singh.pdf",
            "path": "Soft skills - apt, reasoning etc/quantitative-aptitude-ramandeep-singh.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft%20skills%20-%20apt,%20reasoning%20etc/quantitative-aptitude-ramandeep-singh.pdf"
        }
    ],
    "Soft": [
        {
            "name": "CareerDevelopment-Interviews.pdf",
            "path": "Soft/CareerDevelopment-Interviews.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/CareerDevelopment-Interviews.pdf"
        },
        {
            "name": "SoftSkillandEnglishCommunication_75Q.pdf",
            "path": "Soft/SoftSkillandEnglishCommunication_75Q.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/SoftSkillandEnglishCommunication_75Q.pdf"
        },
        {
            "name": "TALLY-9.0-PDF.pdf",
            "path": "Soft/TALLY-9.0-PDF.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/TALLY-9.0-PDF.pdf"
        },
        {
            "name": "gate_cse_study_material_91.pdf",
            "path": "Soft/gate_cse_study_material_91.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/gate_cse_study_material_91.pdf"
        },
        {
            "name": "linked-in-interview-ebook-10-11-17-en.pdf",
            "path": "Soft/linked-in-interview-ebook-10-11-17-en.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/linked-in-interview-ebook-10-11-17-en.pdf"
        },
        {
            "name": "soft-skills-interview-questions.pdf",
            "path": "Soft/soft-skills-interview-questions.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Soft/soft-skills-interview-questions.pdf"
        }
    ],
    "Spring boot": [
        {
            "name": "Spring-Boot-Interview-Questions (1) (1).pdf",
            "path": "Spring boot/Spring-Boot-Interview-Questions (1) (1).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/Spring-Boot-Interview-Questions%20(1)%20(1).pdf"
        },
        {
            "name": "Spring-Interview-Questions (1).pdf",
            "path": "Spring boot/Spring-Interview-Questions (1).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/Spring-Interview-Questions%20(1).pdf"
        },
        {
            "name": "Spring.pdf",
            "path": "Spring boot/Spring.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/Spring.pdf"
        },
        {
            "name": "spring-boot-interview-questions (2).pdf",
            "path": "Spring boot/spring-boot-interview-questions (2).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/spring-boot-interview-questions%20(2).pdf"
        },
        {
            "name": "spring_boot_tutorial.pdf",
            "path": "Spring boot/spring_boot_tutorial.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/Spring%20boot/spring_boot_tutorial.pdf"
        }
    ],
    "plsql": [
        {
            "name": "b14261.pdf",
            "path": "plsql/b14261.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/plsql/b14261.pdf"
        },
        {
            "name": "plsql_tutorial.pdf",
            "path": "plsql/plsql_tutorial.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/plsql/plsql_tutorial.pdf"
        }
    ],
    "power bi": [
        {
            "name": "Croma_Campus_-_Professional_in_Data_Analytics_with_PowerBI.pdf",
            "path": "power bi/Croma_Campus_-_Professional_in_Data_Analytics_with_PowerBI.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Croma_Campus_-_Professional_in_Data_Analytics_with_PowerBI.pdf"
        },
        {
            "name": "Microsoft_Press_ebook_Introducing_Power_BI_PDF_mobile.pdf",
            "path": "power bi/Microsoft_Press_ebook_Introducing_Power_BI_PDF_mobile.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Microsoft_Press_ebook_Introducing_Power_BI_PDF_mobile.pdf"
        },
        {
            "name": "Power BI for Beginners_📊.pdf",
            "path": "power bi/Power BI for Beginners_📊.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Power%20BI%20for%20Beginners_%F0%9F%93%8A.pdf"
        },
        {
            "name": "PowerBI-Online-Training (1).pdf",
            "path": "power bi/PowerBI-Online-Training (1).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/PowerBI-Online-Training%20(1).pdf"
        },
        {
            "name": "PowerBI-Online-Training.pdf",
            "path": "power bi/PowerBI-Online-Training.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/PowerBI-Online-Training.pdf"
        },
        {
            "name": "Unlocking the power of Excel ✅.pdf",
            "path": "power bi/Unlocking the power of Excel ✅.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/power%20bi/Unlocking%20the%20power%20of%20Excel%20%E2%9C%85.pdf"
        }
    ],
    "selenium": [
        {
            "name": "Complete Selenium  Breakdown (1).pdf",
            "path": "selenium/Complete Selenium  Breakdown (1).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/Complete%20Selenium%20%20Breakdown%20(1).pdf"
        },
        {
            "name": "SELENIUM (1).pdf",
            "path": "selenium/SELENIUM (1).pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/SELENIUM%20(1).pdf"
        },
        {
            "name": "Selenium Full Material Updated Greens.pdf",
            "path": "selenium/Selenium Full Material Updated Greens.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/Selenium%20Full%20Material%20Updated%20Greens.pdf"
        },
        {
            "name": "Selenium-Testing-course-Content.pdf",
            "path": "selenium/Selenium-Testing-course-Content.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/Selenium-Testing-course-Content.pdf"
        },
        {
            "name": "TestAutomationusingSeleniumWebDriverJavaPreview.pdf",
            "path": "selenium/TestAutomationusingSeleniumWebDriverJavaPreview.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/TestAutomationusingSeleniumWebDriverJavaPreview.pdf"
        },
        {
            "name": "selenium-tutorial.pdf",
            "path": "selenium/selenium-tutorial.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/selenium-tutorial.pdf"
        },
        {
            "name": "selenium_tutorial.pdf",
            "path": "selenium/selenium_tutorial.pdf",
            "url": "https://raw.githubusercontent.com/b-r-m-h/resources/main/selenium/selenium_tutorial.pdf"
        }
    ]
}
   

    // Get all the top-level keys
    const keys = Object.keys(data);

    // Log the keys to console
    console.log("Available Categories:");
    keys.forEach(key => {
        console.log(key);
    });

    // Optional: render them as clickable elements in HTML
    // const container = document.getElementById("link-container"); // Ensure there's a <div id="category-list"></div> in your HTML
    keys.forEach(key => {
        const item = document.createElement("div");
        item.className = 'link-container';
        item.textContent = key;
        item.style.cursor = "pointer";
        item.style.marginBottom = "8px";

        // Add click listener
        item.addEventListener("click", () => {
            console.log(`You clicked on: ${key}`);
            const pdfs = data[key]; // Get the array of PDFs for this category
            
            document.querySelector('.rightMainContainer').classList.remove('hidden');
            linksRight.textContent = '';
            console.log(`PDFs available in ${key}:`);
            pdfs.forEach(pdf => {
                console.log(pdf);

                
                const a = document.createElement('a');
                a.className = 'rightLinks';
                a.textContent = pdf.name;
                a.href = pdf.url;
                linksRight.appendChild(a);
                const br = document.createElement('br');
                linksRight.appendChild(br);
            });


        });

        fileContainer.appendChild(item);
    });
}


async function fetchAllFiles(){
    try{
        console.log("ok")
        // let res = await fetch(`/api/pdfs`);
        // let data = await res.json();
        // console.log(data);
        // dataFiles = data;
    }
    catch(err){
        console.log(err);
    }
}

function closeRightContainer(){
    console.log('btn clicked');
    document.querySelector('.rightMainContainer').classList.add('hidden')
}