import Enlang from './entries/en-US';
import Vnlang from './entries/vi_VN';
import { addLocaleData } from 'react-intl';

const AppLocale = {
    en: Enlang,
    vi: Vnlang,
};
console.log('addLocaleData',addLocaleData(AppLocale.en.data))
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.vi.data);

export default AppLocale;