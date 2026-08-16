/**
 * asyncHandler — wraps an async Express route handler so that any rejected
 * promise (thrown error, failed API call, etc.) gets forwarded to Express's
 * error-handling middleware via next(err), instead of becoming an unhandled
 * promise rejection that crashes the whole Node process.
 *
 * Usage: router.post("/", asyncHandler(myController))
 */
export default function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
