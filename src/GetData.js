class Data {
	static test = ""


	static getWatchLists = () => {
		return new Promise((ok, fail) => {
			fetch("http://192.168.1.102:8000/getWatchlists", {
				//mode: "cors",
				headers: { "Content-Type": "application/json" },
			})
				.then((response) => response.json())
				.then((response) => {
					console.log(response);
					ok(response)
				})
				.catch(error => fail(error));
		})
	}

	static getStatus = () => {
		fetch(`http://192.168.1.102:8000/status`, {
			//mode: "cors",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => response.json())
			.then((status) => { return status});
	};
	
	static getState = () => {
		fetch(`http://192.168.1.102:8000/state`, {
			//mode: "cors",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => response.json())
			.then((state) => {return state});
	};
}


export default Data