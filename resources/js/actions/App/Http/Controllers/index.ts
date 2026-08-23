import WelcomeController from './WelcomeController'
import MarketplaceController from './MarketplaceController'
import ListingDetailController from './ListingDetailController'
import BecomeSellerController from './BecomeSellerController'
import BillingController from './BillingController'
import ListingFavoriteController from './ListingFavoriteController'
import InboxController from './InboxController'
import AgreementController from './AgreementController'
import TransactionController from './TransactionController'
import NotificationController from './NotificationController'
import SellerDashboardController from './SellerDashboardController'
import ListingController from './ListingController'
import Auth from './Auth'
import XenditWebhookController from './XenditWebhookController'
import Settings from './Settings'
import SellerProfileController from './SellerProfileController'
import SellerDocumentController from './SellerDocumentController'
const Controllers = {
    WelcomeController: Object.assign(WelcomeController, WelcomeController),
MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
ListingDetailController: Object.assign(ListingDetailController, ListingDetailController),
BecomeSellerController: Object.assign(BecomeSellerController, BecomeSellerController),
BillingController: Object.assign(BillingController, BillingController),
ListingFavoriteController: Object.assign(ListingFavoriteController, ListingFavoriteController),
InboxController: Object.assign(InboxController, InboxController),
AgreementController: Object.assign(AgreementController, AgreementController),
TransactionController: Object.assign(TransactionController, TransactionController),
NotificationController: Object.assign(NotificationController, NotificationController),
SellerDashboardController: Object.assign(SellerDashboardController, SellerDashboardController),
ListingController: Object.assign(ListingController, ListingController),
Auth: Object.assign(Auth, Auth),
XenditWebhookController: Object.assign(XenditWebhookController, XenditWebhookController),
Settings: Object.assign(Settings, Settings),
SellerProfileController: Object.assign(SellerProfileController, SellerProfileController),
SellerDocumentController: Object.assign(SellerDocumentController, SellerDocumentController),
}

export default Controllers