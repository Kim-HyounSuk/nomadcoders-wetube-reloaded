import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errMsg: "Password confirmation does not match.",
    });
  }

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errMsg: "This username/email is already taken.",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });

    return res.redirect("/login");
  } catch (err) {
    return res.status(400).render("join", {
      pageTitle,
      errMsg: err._message,
    });
  }
};
export const getLogin = (req, res) => {
  return res.render("login", {
    pageTitle: "Login",
  });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errMsg: "An account with this username does not exists.",
    });
  }

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) {
    return res.status(400).render("login", {
      pageTitle,
      errMsg: "Wrong password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
