# KakaoBot-Akinator
이 모듈은 https://github.com/jgoralcz/aki-api 을 포팅한 모듈입니다.(사실 대부분 뜯어고쳤.. 읍읍)

# 사용법
aki.js 파일을 메신저봇R 폴더 - global_modules 폴더속에 넣는다.

# 예제소스
```javascript
const aki = require("aki");
const akinator = {};

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	if (msg == ".아키네이터 시작") {
		if (!akinator[room])
		akinator[room] = {};
		if (!akinator[room]["start"])
		akinator[room]["start"] = {};
		akinator[room]["start"][sender] = true;
		if (!akinator[room][sender])
		akinator[room][sender] = new aki("kr");
		else {
			replier.reply("이미 당신의 이름으로된 게임이 진행중입니다. 이름을 변경하시거나 게임을 이어나가주세요. 게임 종료는 \".아키네이터 종료\"로 가능합니다.");
			return;
		}
		
		akinator[room][sender].start();
		replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ"));
	}
	
	if (msg == ".아키네이터 종료") {
		if (!akinator[room]) {
			replier.reply("게임이 진행중이지 않습니다.");
			return;
		} else {
			if (!akinator[room][sender]) {
				replier.reply("게임이 진행중이지 않습니다.");
				return;
			} else {
				delete akinator[room][sender];
				delete akinator[room]["start"][sender];
				replier.reply("종료되었습니다.");
			}
		}
	}
	
	if (msg == "예") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					akinator[room][sender].win();
					replier.reply("[" + sender + "] 인물: " + akinator[room][sender].answers[0].name + "\n  ㄴ맞습니다\n  ㄴ아닙니다");
				} else {
					akinator[room][sender].step(0);
					akinator[room]["start"][sender] = false;
					replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
				}
			}
		}
	}
	
	if (msg == "아니오") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					akinator[room][sender].win();
					replier.reply("[" + sender + "] 인물: " + akinator[room][sender].answers[0].name + "\n  ㄴ맞습니다\n  ㄴ아닙니다");
				} else {
					akinator[room][sender].step(1);
					akinator[room]["start"][sender] = false;
					replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
				}
			}
		}
	}
	
	if (msg == "모르겠습니다") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					akinator[room][sender].win();
					replier.reply("[" + sender + "] 인물: " + akinator[room][sender].answers[0].name + "\n  ㄴ맞습니다\n  ㄴ아닙니다");
				} else {
					akinator[room][sender].step(2);
					akinator[room]["start"][sender] = false;
					replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
				}
			}
		}
	}
	
	if (msg == "그럴겁니다") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					akinator[room][sender].win();
					replier.reply("[" + sender + "] 인물: " + akinator[room][sender].answers[0].name + "\n  ㄴ맞습니다\n  ㄴ아닙니다");
				} else {
					akinator[room][sender].step(3);
					akinator[room]["start"][sender] = false;
					replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
				}
			}
		}
	}
	
	if (msg == "아닐겁니다") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					akinator[room][sender].win();
					replier.reply("[" + sender + "] 인물: " + akinator[room][sender].answers[0].name + "\n  ㄴ맞습니다\n  ㄴ아닙니다");
				} else {
					akinator[room][sender].step(4);
					akinator[room]["start"][sender] = false;
					replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
				}
			}
		}
	}
	
	if (msg == "뒤로가기") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (!akinator[room]["start"][sender]) {
					if (!(akinator[room][sender].progress > 80)) {
						akinator[room][sender].back();
						if (akinator[room][sender].currentStep == 0) {
							replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ"));
							akinator[room]["start"][sender] = true;
						} else
						replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
					}
				}
			}
		}
	}
	
	if (msg == "맞습니다") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					replier.reply("[" + sender + "] 아키네이터가 이겼습니다!\n아키네이터가 맞춘인물: " + akinator[room][sender].answers[0].name);
					delete akinator[room][sender];
					delete akinator[room]["start"][sender];
				}
			}
		}
	}
	
	if (msg == "아닙니다") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					replier.reply("[" + sender + "] 계속하시겠습니까?\n  ㄴ계속\n  ㄴ.아키네이터 종료");
				}
			}
		}
	}
	
	if (msg == "계속") {
		if (akinator[room]) {
			if (akinator[room][sender]) {
				if (akinator[room][sender].progress > 80) {
					akinator[room][sender].continue();
					replier.reply("[" + sender + "] 질문: " + akinator[room][sender].question + "\n  ㄴ" + akinator[room][sender].answers.join("\n  ㄴ") + "\n  ㄴ뒤로가기\n진행률: " + akinator[room][sender].progress + "%");
				}
			}
		}
	}
}
```
