import User from "../models/User.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
    console.log(err);
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
  const { email, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ email, socialOnly: false }).populate(
    "videos"
  );
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errMsg: "가입된 계정이 존재하지 않습니다. Email 정보를 확인해주세요.",
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
export const startGithubLogin = (req, res) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;
  return res.redirect(finalURL);
};
export const finishGithubLogin = async (req, res) => {
  const baseURL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;
  const tokenRequest = await (
    await fetch(finalURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiURL = "https://api.github.com";
    const userData = await (
      await fetch(`${apiURL}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiURL}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) return res.redirect("/login");
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        username: userData.login,
        avatarUrl: userData.avatarUrl,
        socialOnly: true,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("user/profile", {
    pageTitle: `${user.name}'s Profile`,
    user,
  });
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const { _id, avatarUrl } = req.session.user;
  const { name, email, username, location } = req.body;
  const { file } = req;
  const exists = await User.exists({ $or: [{ username, email }] });
  if (!exists) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errMsg: "This username/email is already taken.",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? User.changePathFormula(file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("user/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const { _id } = req.session.user;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errMsg: "기존 비밀번호가 일치하지 않습니다.",
    });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errMsg: "새 비밀번호가 일치하지 않습니다.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};
export const remove = (req, res) => res.send("Remove User");
