import PropTypes from "prop-types";

function Message({ message, isMyMessage = false, sent_by, isGroup }) {
  const myMessageClassList =
    "mr-3 rounded-tr-xl  self-end ml-14 my-message bg-green-300";
  const yourMessageClassList =
    "ml-3 rounded-tl-xl self-start mr-14 someones-message bg-green-500";

  return (
    <div
      className={`p-2 md:max-w-[70%] max-w-[90%] mb-3 text-sm md:text-base md:font-semibold text-slate-700 message relative rounded-xl min-w-[50px] ${
        isMyMessage ? myMessageClassList : yourMessageClassList
      } flex flex-col`}
    >
      {!isMyMessage && isGroup && (
        <span className="text-orange-900 text-xs">{sent_by}</span>
      )}
      <span>{message}</span>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isMyMessage: PropTypes.bool,
  sent_by: PropTypes.string,
  isGroup: PropTypes.bool,
};

export default Message;
