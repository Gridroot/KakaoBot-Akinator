module.exports = (function () {
	function akinator(region, childMode) {
		this.region = region;
		this.childMode = {
			childMod: childMode === true ? "true" : "",
			softConstraint: childMode === true ? "ETAT%3D%27EN%27" : "",
			questionFilter: childMode === true ? "cat%3D1" : "",
		};
		this.currentStep = 0;
		this.progress = 0;
	}
	
	function getURL(region) {
		const url = "https://" + region + ".akinator.com";
		const page = org.jsoup.Jsoup.connect(url).get().toString();
		return {url: url, urlWs: JSON.parse(page.split("'arrUrlThemesToPlay', ")[1].split(");")[0])[0].urlWs};
	}
	
	function getSession(region) {
		const url = "https://" + region + ".akinator.com/game";
		const page = org.jsoup.Jsoup.connect(url).get().toString();
		return {uid: page.split("var uid_ext_session = '")[1].split("'")[0], frontaddr: page.split("var frontaddr = '")[1].split("'")[0]};
	}
	
	akinator.prototype.getStartURL = function () {
		let url = this.url;
		url += "/new_session";
		url += "?callback=jQuery341025547419405343974_" + new Date().getTime();
		url += "&urlApiWs=" + this.urlApiWs;
		url += "&player=website-desktop&partner=1&uid_ext_session=" + this.uid;
		url += "&frontaddr=" + this.frontaddr;
		url += "&childMod=" + this.childMode.childMod;
		url += "&constraint=ETAT%3C%3E%27AV%27";
		url += "&soft_constraint=" + this.childMode.softConstraint;
		url += "&question_filter=" + this.childMode.questionFilter;
		url += "&_=" + new Date().getTime();
		
		return url;
	}
	
	akinator.prototype.getAnswerURL = function (answerId) {
		let url = this.url;
		url += "/answer_api";
		url += "?callback=jQuery341025547419405343974_" + new Date().getTime();
		url += "&urlApiWs=" + this.urlApiWs;
		url += "&session=" + this.session;
		url += "&signature=" + this.signature;
		url += "&step=" + this.currentStep;
		url += "&frontaddr=" + this.frontaddr;
		url += "&answer=" + answerId;
		url += "&question_filter=" + this.childMode.questionFilter;
		url += "&_=" + new Date().getTime();
		
		return url;
	}
	
	akinator.prototype.getBackURL = function () {
		let url = this.urlApiWs;
		url += "/cancel_answer";
		url += "?callback=jQuery341025547419405343974_" + new Date().getTime();
		url += "&session=" + this.session;
		url += "&signature=" + this.signature;
		url += "&step=" + this.currentStep;
		url += "&answer=-1";
		url += "&question_filter=" + this.childMode.questionFilter;
		url += "&_=" + new Date().getTime();
		
		return url;
	}
	
	akinator.prototype.getWinURL = function () {
		let url = this.urlApiWs;
		url += "/list";
		url += "?callback=jQuery341025547419405343974_" + new Date().getTime();
		url += "&session=" + this.session;
		url += "&signature=" + this.signature;
		url += "&step=" + this.currentStep;
		url += "&size=2";
		url += "&max_pic_width=246";
		url += "&max_pic_height=294";
		url += "&pref_photos=VO-OK";
		url += "&duel_allowed=1";
		url += "&mode_question=0";
		url += "&_=" + new Date().getTime();
		
		return url;
	}
	
	akinator.prototype.getContinueURL = function () {
		let url = this.urlApiWs;
		url += "/exclusion";
		url += "?callback=jQuery341025547419405343974_" + new Date().getTime();
		url += "&session=" + this.session;
		url += "&signature=" + this.signature;
		url += "&step=" + this.currentStep;
		url += "&forward_answer=1";
		url += "&question_filter=" + this.childMode.questionFilter;
		url += "&_=" + new Date().getTime();
		
		return url;
	}
	
	akinator.prototype.start = function () {
		const server = getURL(this.region);
		
		this.url = server.url;
		this.urlApiWs = server.urlWs;
		this.sessionObj = getSession(this.region);
		this.uid = this.sessionObj.uid;
		this.frontaddr = this.sessionObj.frontaddr;
		
		const url = this.getStartURL();
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.session = json.parameters.identification.session;
		this.signature = json.parameters.identification.signature;
		this.question = json.parameters.step_information.question;
		this.challenge_auth = json.parameters.identification.challenge_auth;
		this.answers = json.parameters.step_information.answers.map(ans => ans.answer);
	}
	
	akinator.prototype.step = function (answerId) {
		if (!this.url) throw new Error("start하지 않았습니다.");
		
		const url = this.getAnswerURL(answerId);
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.currentStep = this.currentStep + 1;
		this.progress = json.parameters.progression;
		this.question = json.parameters.question;
		this.answers = json.parameters.answers.map(ans => ans.answer);
	}
	
	akinator.prototype.back = function () {
		if (!this.url) throw new Error("start하지 않았습니다.");
		
		const url = this.getBackURL();
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").ignoreContentType(true).get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.currentStep = this.currentStep - 1;
		this.progress = json.parameters.progression;
		this.question = json.parameters.question;
		this.answers = json.parameters.answers.map(ans => ans.answer);
	}
	
	akinator.prototype.win = function () {
		if (!this.url) throw new Error("start하지 않았습니다.");
		
		const url = this.getWinURL();
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").ignoreContentType(true).get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.answers = (json.parameters.elements || []).map(ele => ele.element);
		for (let i = 0; i < this.answers.length; i += 1) {
			this.answers[i].nsfw = ["x", "pornstar"].includes((this.answers[i].pseudo || "").toLowerCase());
		}
		
		this.guessCount = json.parameters.NbObjetsPertinents;
	}
	
	akinator.prototype.continue = function () {
		if (!this.url) throw new Error("start하지 않았습니다.");
		
		const url = this.getContinueURL();
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").ignoreContentType(true).get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.currentStep = this.currentStep + 1;
		this.progress = json.parameters.progression;
		this.question = json.parameters.question;
		this.answers = json.parameters.answers.map(ans => ans.answer);
	}
	
	return akinator;
})();
