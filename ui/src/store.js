import { reactive, toRefs, getCurrentInstance } from "vue";

const state = reactive({
    layout: [],
    components: [],
});

export default function stateStore() {
    const fetchLayout = async () => {
        const instance = getCurrentInstance()
        const plbConf = instance.appContext.config.globalProperties.plb;

        if (plbConf === undefined) {
            const url = 'http://localhost:3000/layout';
            state.layout = await (await fetch(url)).json();
        } else {
            state.layout = await (plbConf.layout);
        }
    }

    const fetchComponents = async () => {
        const instance = getCurrentInstance()
        const plbConf = instance.appContext.config.globalProperties.plb;

        if (plbConf === undefined) {
            const url = 'http://localhost:3000/components';
            state.components = await (await fetch(url)).json();
        } else {
            state.components = await (plbConf.components);
        }
    }

    /**
      * Add a new field to the layout.
      * 
      * @param {String} pos Indicates if the field should be added before or after the current field.
      * @param {Number} index Current field position used as reference.
      * @param {Number} cols Number of columns to add.
      */
    const addRow = (pos, index, cols) => {
        const position = index + (pos === 'after' ? 1 : 0)
        const rowTpl = { "cols": [] };

        for (let i = 0; i < cols; i++) {
            // colTpl must be inside the loop to avoid references to the same object.
            const colTpl = { "components": [] };
            rowTpl.cols.push(colTpl);
        }

        state.layout.rows.splice(position, 0, rowTpl);
    }

    return {
        ...toRefs(state),
        fetchLayout,
        fetchComponents,
        addRow
    }
}