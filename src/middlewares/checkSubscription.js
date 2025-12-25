// import Owner from "../models/Owner.model.js";

// const checkSubscription = async (req, res, next) => {
//   try {
//     /**
//      * Public menu access (QR scan)
//      * Route → /api/menu/:username
//      */
//     const { username } = req.params;

//     if (!username) {
//       return res.status(400).json({
//         success: false,
//         subscribed: false,
//         message: "Restaurant username is required",
//       });
//     }

//     const owner = await Owner.findOne({ username }).select(
//       "subscription"
//     );

//     if (!owner) {
//       return res.status(404).json({
//         success: false,
//         subscribed: false,
//         message: "Restaurant not found",
//       });
//     }

//     const subscription = owner.subscription;

//     // ❌ No subscription info
//     if (!subscription) {
//       return res.status(403).json({
//         success: false,
//         subscribed: false,
//         message: "Subscription not found",
//       });
//     }

//     const status = subscription.status;
//     const now = new Date();

//     /* =========================
//        ✅ ALLOW MENU ACCESS
//     ========================= */
//     if (status === "trialing") {
//       // Optional safety: trial expiry check
//       if (!subscription.trial_end || subscription.trial_end > now) {
//         req.owner = owner;
//         return next();
//       }
//     }

//     if (status === "active") {
//       // Optional safety: paid expiry check
//       if (
//         !subscription.current_period_end ||
//         subscription.current_period_end > now
//       ) {
//         req.owner = owner;
//         return next();
//       }
//     }

//     /* =========================
//        ❌ BLOCK MENU ACCESS
//     ========================= */
//     return res.status(403).json({
//       success: false,
//       subscribed: false,
//       message: "Restaurant subscription inactive",
//     });
//   } catch (error) {
//     console.error("checkSubscription error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export default checkSubscription;





import Owner from "../models/Owner.model.js";

const checkSubscription = async (req, res, next) => {
  try {
    /**
     * Public menu access (QR scan)
     * Route → /api/menu/:username
     */
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        subscribed: false,
        message: "Restaurant username is required",
      });
    }

    const owner = await Owner.findOne({ username }).select("subscription");

    if (!owner) {
      return res.status(404).json({
        success: false,
        subscribed: false,
        message: "Restaurant not found",
      });
    }

    const subscription = owner.subscription;

    if (!subscription) {
      return res.status(403).json({
        success: false,
        subscribed: false,
        message: "Subscription not found",
      });
    }

    const now = new Date();
    const { status, trialEnd, currentPeriodEnd } = subscription;

    /* =========================
       ✅ TRIAL ACCESS
    ========================= */
    if (
      status === "TRIALING" &&
      trialEnd &&
      now < new Date(trialEnd)
    ) {
      req.owner = owner;
      return next();
    }

    /* =========================
       ✅ PAID ACCESS (ACTIVE / CANCELLED)
    ========================= */
    if (
      ["ACTIVE", "CANCELLED"].includes(status) &&
      currentPeriodEnd &&
      now < new Date(currentPeriodEnd)
    ) {
      req.owner = owner;
      return next();
    }

    /* =========================
       ❌ BLOCK ACCESS
    ========================= */
    return res.status(403).json({
      success: false,
      subscribed: false,
      message: "Restaurant subscription inactive or expired",
    });

  } catch (error) {
    console.error("checkSubscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default checkSubscription;
