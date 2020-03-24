import Plugin from './Plugin';
import TapablePlugin from './TapablePlugin';

type Hook = 'onAction' | 'onError';

const plugin = new Plugin<Hook>(['onAction', 'onError']);

const tapablePlugin = new TapablePlugin();