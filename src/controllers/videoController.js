import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import fs from "fs";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .populate("owner")
    .sort({ createdAt: "desc" });

  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== req.session.user._id) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  console.log(video.owner, _id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  ``;
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  console.log("ok");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { _id: owner } = req.session.user;
  const { path: videoUrl } = req.files.video[0];
  const { path: thumbUrl } = req.files.thumb[0];
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: Video.changePathFormula(videoUrl),
      thumbUrl: Video.changePathFormula(thumbUrl),
      owner,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(owner);
    user.videos.push(newVideo._id);
    user.save();
    req.session.user = user;
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errMsg: err._message,
    });
  }

  return res.redirect("/");
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { _id, videos } = req.session.user;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  fs.unlink(video.fileUrl, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).render("watch", {
        pageTitle: video.title,
        video,
        errMsg: "동영상 삭제 중 오류가 발생했습니다.",
      });
    }
  });
  fs.unlink(video.thumbUrl, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).render("watch", {
        pageTitle: video.title,
        video,
        errMsg: "썸네일 삭제 중 오류가 발생했습니다.",
      });
    }
  });
  const updatedUser = await User.findByIdAndUpdate(_id, {
    videos: videos.filter((video) => String(video) !== id),
  });
  req.session.user = updatedUser;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }

  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id, userInfo: user });
};

export const deleteComment = async (req, res) => {
  const { _id } = req.session.user;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).populate("owner");
  const videoId = comment.video;
  if (String(_id) !== String(comment.owner._id)) {
    return res.sendStatus(404);
  }
  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(commentId), 1);
  await video.save();
  await Comment.findByIdAndDelete(commentId);

  return res.sendStatus(200);
};
