//html代码转换javascript代码
function javascript() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = "<script language=\"JavaScript\">\n<!--\n/\/\-->\n</script>";
	}
	else {
		output = "document.writeln(\"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\");";
				if (c != input.length - 1)
					output += "\ndocument.writeln(\"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "/\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\");";
					}
				}
			}
		}
		document.getElementById("result").value = "<script language=\"JavaScript\">\n<!--\n" + output + "\n/\/\-->\n</script>";
	}
}

//html代码转换asp代码
function asp() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = "<%\n%>";
	}
	else {
		output = "Response.Write \"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\"";
				if (c != input.length - 1)
					output += "\nResponse.Write \"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "\"\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\"";
					}
				}
			}
		}
		document.getElementById("result").value = "<%\n" + output + "\n%>";
	}
}

//html代码转换php代码
function php() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = "<?php\n?>";
	}
	else {
		output = "echo \"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\\n\";";
				if (c != input.length - 1)
					output += "\necho \"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "\\\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\\n\";";
					}
				}
			}

		}
		document.getElementById("result").value = "<?php\n" + output + "\n?>";
	}
}

//html代码转换Jsp代码
function Jsp() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = "<%\n%>";
	}
	else {
		output = "out.println(\"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\");";
				if (c != input.length - 1)
					output += "\nout.println(\"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "\\\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\");";
					}
				}
			}

		}
		document.getElementById("result").value = "<%\n" + output + "\n%>";
	}
}

//html代码转换Perl代码
function Perl() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = output;
	}
	else {
		output = "print \"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\\n\";";
				if (c != input.length - 1)
					output += "\nprint \"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "\\\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\\n\";";
					}
				}
			}
		}
		document.getElementById("result").value = output;
	}
}


//html代码转换vbnet代码
function vbnet() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = "<%\n%>";
	}
	else {
		output = "Response.Write (\"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\");";
				if (c != input.length - 1)
					output += "\nResponse.Write (\"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "\"\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\");";
					}
				}
			}
		}
		document.getElementById("result").value = "<%\n" + output + "\n%>";
	}
}

//html代码转换Sws代码
function Sws() {
	var input = document.getElementById("content").value;
	if (input == "") {
		document.getElementById("result").value = output;
	}
	else {
		output = "STRING \"";
		for (var c = 0; c < input.length; c++) {
			if ((input.charAt(c) == "\n" || input.charAt(c) == "\r")) {
				output += "\"";
				if (c != input.length - 1)
					output += "\nSTRING \"";
				c++;
			}
			else {
				if (input.charAt(c) == "\"") {
					output += "\\\"";
				}
				else {
					if (input.charAt(c) == "\\") {
						output += "\\\\";
					}

					else {
						output += input.charAt(c);
						if (c == input.length - 1)
							output += "\"";
					}
				}
			}
		}
		document.getElementById("result").value = output;
	}
}

//开始转换按钮
function d(type) {
	document.getElementById("result").value = '';
	if (type == "javascript") {
		javascript();
	}	else if (type == "asp") {
		asp();
	}	else if (type == 'php') {
		php();
	} else if (type == 'jsp') {
		Jsp();
	}	else if (type == 'perl') {
		Perl();
	}	else if (type == 'sws') {
		Sws();
	}	else if (type == 'vbnet') {
		vbnet();
	}
}
