import { ClassType, ComponentResolver, ComponentFactoryResolver } from 'mojiito-core';
import { BindingParser } from '../binding_parser';
import { CompileComponentSummary } from './compile_result';
export declare class Compiler {
    private _resolver;
    private _bindParser;
    private _compileResults;
    constructor(_resolver: ComponentResolver, _bindParser: BindingParser);
    createComponentFactoryResolver(): ComponentFactoryResolver;
    compileComponents(components: ClassType<any>[]): CompileComponentSummary[];
    compileComponent<C>(component: ClassType<C>): CompileComponentSummary;
    private _createProviderNodes(providers, nodes, nodeType);
    private _createComponentRendererType(visitor);
    private _createComponentViewDef(component, providers, componentRendererType);
}
