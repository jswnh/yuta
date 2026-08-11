import BecomeSellerController from './BecomeSellerController'
import BillingController from './BillingController'
import ListingController from './ListingController'
import Auth from './Auth'
import XenditWebhookController from './XenditWebhookController'
import Settings from './Settings'
const Controllers = {
    BecomeSellerController: Object.assign(BecomeSellerController, BecomeSellerController),
BillingController: Object.assign(BillingController, BillingController),
ListingController: Object.assign(ListingController, ListingController),
Auth: Object.assign(Auth, Auth),
XenditWebhookController: Object.assign(XenditWebhookController, XenditWebhookController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers