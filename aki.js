module.exports = (function () {
	function akinator(region, childMode) {
		this.region = region;
		this.childMode = {
			childMod: childMode === true,
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
	
	akinator.prototype.start = function () {
		const server = getURL(this.region);
		
		this.url = server.url;
		this.urlApiWs = server.urlWs;
		this.sessionObj = getSession(this.region);
		this.uid = this.sessionObj.uid;
		this.frontaddr = this.sessionObj.frontaddr;
		
		const url = this.url + "/new_session?callback=jQuery331023608747682107778_" + new Date().getTime() + "&urlApiWs=" + this.urlApiWs + "&partner=1&childMod=" + this.childMode.childMod + "&player=website-desktop&uid_ext_session=" + this.uid + "&frontaddr=" + this.frontaddr + "&constraint=ETAT<>'AV'&soft_constraint=" + this.childMode.softConstraint + "&question_filter=" + this.childMode.questionFilter;
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
		
		const url = this.url + "/answer_api?callback=jQuery331023608747682107778_" + new Date().getTime() + "&urlApiWs=" + this.urlApiWs + "&childMod=" + this.childMode.childMod + "&session=" + this.session + "&signature=" + this.signature + "&step=" + this.currentStep + "&answer=" + answerId + "&frontaddr=" + this.frontaddr + "&question_filter=" + this.childMode.questionFilter;
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.currentStep = this.currentStep + 1;
		this.progress = json.parameters.progression;
		this.question = json.parameters.question;
		this.answers = json.parameters.answers.map(ans => ans.answer);
	}
	
	akinator.prototype.back = function () {
		if (!this.url) throw new Error("start하지 않았습니다.");
		
		const url = this.urlApiWs + "/cancel_answer?&callback=jQuery331023608747682107778_" + new Date().getTime() + "&session=" + this.session + "&childMod=" + this.childMode.childMod + "&signature=" + this.signature + "&step=" + this.currentStep + "&answer=-1&question_filter=" + this.childMode.questionFilter;
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").ignoreContentType(true).get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.currentStep = this.currentStep - 1;
		this.progress = json.parameters.progression;
		this.question = json.parameters.question;
		this.answers = json.parameters.answers.map(ans => ans.answer);
	}
	
	akinator.prototype.win = function () {
		if (!this.url) throw new Error("start하지 않았습니다.");
		
		const url = this.urlApiWs + "/list?callback=jQuery331023608747682107778_" + new Date().getTime() + "&signature=" + this.signature +"&childMod=" + this.childMode.childMod + "&step=" + this.currentStep + "&session=" + this.session;
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
		
		const url = this.urlApiWs + "/exclusion?&callback=jQuery331023608747682107778_" + new Date().getTime() + "&session=" + this.session + "&childMod=" + this.childMode.childMod + "&signature=" + this.signature + "&step=" + this.currentStep + "&question_filter=" + this.childMode.questionFilter + "&forward_answer=1";
		const page = org.jsoup.Jsoup.connect(url).header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8").header("x-requested-with", "XMLHttpRequest").userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.92 Chrome/81.0.4044.92 Safari/537.36").ignoreContentType(true).get().text(); //*/
		const json = JSON.parse(page.substring(page.indexOf("(") + 1, page.length - 1));
		
		this.currentStep = this.currentStep + 1;
		this.progress = json.parameters.progression;
		this.question = json.parameters.question;
		this.answers = json.parameters.answers.map(ans => ans.answer);
	}
	
	return akinator;
})();