import BecomeSellerController from './BecomeSellerController'
import Auth from './Auth'
import Settings from './Settings'
const Controllers = {
    BecomeSellerController: Object.assign(BecomeSellerController, BecomeSellerController),
Auth: Object.assign(Auth, Auth),
Settings: Object.assign(Settings, Settings),
}

export default Controllers