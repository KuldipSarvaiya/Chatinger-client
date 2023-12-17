import PropTypes from "prop-types";

function Message({ message, isMyMessage = false }) {
  const myMessageClassList = "mr-3 rounded-tr-xl rounded-l-xl self-end ml-14";
  const yourMessageClassList = "ml-3 rounded-tl-xl rounded-r-xl self-start mr-14";

  return (
    <div
      className={`p-3 bg-green-500 max-w-fit mb-3 ${
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
