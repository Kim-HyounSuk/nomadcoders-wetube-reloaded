const fakeUser = {
  username: "Kim",
  loggedIn: true,
};

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser });
export const see = (req, res) => res.send("Watch");
export const search = (req, res) => res.send("Search");
export const edit = (req, res) => res.send("Edit");
export const upload = (req, res) => res.send("Upload");
export const remove = (req, res) => res.send("Delete Video");
