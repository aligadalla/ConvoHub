const AsyncWrapper = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
};
  
export default AsyncWrapper;