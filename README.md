# KakaoBot-Akinator
이 모듈은 https://github.com/jgoralcz/aki-api 을 포팅한 모듈입니다.

# 예제 (덜만듬)
```javascript
var aki = require("aki");
var akinator = new aki("kr");

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if (msg == "a시작") {
    akinator.start();
    replier.reply("질문: " + akinator.question + "\n" + akinator.answers.join("\n"));
  }
  
  if (msg == "a예") {
    if (akinator.progress > 70 || akinator.currentStep > 78) {
      akinator.win();
      replier.reply("인물: " + akinator.answers[0].name + "\n맞습니다\n아닙니다");
    } else {
      akinator.step(0);
      replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
    }
  }
  
  if (msg == "a아니오") {
    if (akinator.progress > 70 || akinator.currentStep > 78) {
      akinator.win();
      replier.reply("인물: " + akinator.answers[0].name + "\n맞습니다\n아닙니다");
    } else {
      akinator.step(1);
      replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
    }
  }

  if (msg == "a모르겠습니다") {
    if (akinator.progress > 70 || akinator.currentStep > 78) {
      akinator.win();
      replier.reply("인물: " + akinator.answers[0].name + "\n맞습니다\n아닙니다");
    } else {
      akinator.step(3);
      replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
    }
  }
  
  if (msg == "a그럴겁니다") {
    if (akinator.progress > 70 || akinator.currentStep > 78) {
      akinator.win();
      replier.reply("인물: " + akinator.answers[0].name + "\n맞습니다\n아닙니다");
    } else {
      akinator.step(4);
      replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
    }
  }
  
  if (msg == "a아닐겁니다") {
    if (akinator.progress > 70 || akinator.currentStep > 78) {
      akinator.win();
      replier.reply("인물: " + akinator.answers[0].name + "\n맞습니다\n아닙니다");
    } else {
      akinator.step(5);
      replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
    }
  }
  
  ​if (msg == "a뒤로") {
    akinator.back();
    replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
  }
  
  if (msg == "a아닙니다") {
    for (let i = 0; i < 3; i++) {
      akinator.back();
    }
    replier.reply("질문: " + akinator.question + " (" + akinator.progress + ")\n" + akinator.answers.join("\n"));  
  }
  
  if (msg == "a맞습니다") {
    replier.reply("아키네이터가 이겼습니다.");
    akinator = new aki("kr");
  }
}
```
