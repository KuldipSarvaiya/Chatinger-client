import PropTypes from "prop-types";

function Message({ message, isMyMessage = false }) {
  const myMessageClassList = "mr-3 rounded-tr-xl  self-end ml-14 my-message";
  const yourMessageClassList = "ml-3 rounded-tl-xl self-start mr-14 someones-message";

  return (
    <div
      className={`p-3 bg-green-500 max-w-fit mb-3 text-xs md:text-base md:font-semibold text-slate-700 message relative rounded-xl min-w-[50px] ${
        isMyMessage ? myMessageClassList : yourMessageClassList
      }`}
    >
      {message}
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isMyMessage: PropTypes.bool,
};

export default Message;
