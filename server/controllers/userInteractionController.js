const User = require("../models/user");

const followPublisher = async (req, res) => {
    const { userToken, publisherToken } = req.body;
    try {
        const user = await User.findOne({ user_token: userToken });
        if (!user) return res.status(404).send({ msg: "User not found" });

        if (!user.followedPublishers.includes(publisherToken)) {
            user.followedPublishers.push(publisherToken);
            await user.save();
            res.status(200).send({ msg: "Followed successfully", followed: true });
        } else {
            user.followedPublishers = user.followedPublishers.filter(id => id !== publisherToken);
            await user.save();
            res.status(200).send({ msg: "Unfollowed successfully", followed: false });
        }
    } catch (error) {
        console.error("Follow Publisher Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const getFollowStatus = async (req, res) => {
    const { userToken, publisherToken } = req.body;
    try {
        const user = await User.findOne({ user_token: userToken });
        if (!user) return res.status(404).send({ msg: "User not found" });

        const isFollowing = user.followedPublishers.includes(publisherToken);
        res.status(200).send({ isFollowing });
    } catch (error) {
        console.error("Get Follow Status Error:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = { followPublisher, getFollowStatus };
